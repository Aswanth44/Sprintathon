package com.uzhavarsetu.service;

import com.uzhavarsetu.entity.GovernmentScheme;
import com.uzhavarsetu.entity.SchemeEligibilityRule;
import com.uzhavarsetu.repository.GovernmentSchemeRepository;
import com.uzhavarsetu.repository.SchemeEligibilityRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class SchemeDataSeeder implements CommandLineRunner {

    @Autowired
    private GovernmentSchemeRepository schemeRepository;

    @Autowired
    private SchemeEligibilityRuleRepository ruleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (schemeRepository.count() > 0) {
            return;
        }

        String todayStr = LocalDate.now().toString();

        // 1. PM-KISAN
        GovernmentScheme pmKisan = new GovernmentScheme();
        pmKisan.setSchemeCode("PM-KISAN");
        pmKisan.setSchemeName("Pradhan Mantri Kisan Samman Nidhi");
        pmKisan.setShortDescription("Direct income support of ₹6,000 per year in three equal instalments to eligible landholding farmer families across India.");
        pmKisan.setFullDescription("Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector Scheme providing financial support to landholding farmer families to enable them to procure agricultural inputs and meet domestic needs. Under the scheme, ₹6,000 per year is transferred directly into the bank accounts of eligible farmers in three equal instalments of ₹2,000 every four months.");
        pmKisan.setMinistry("Ministry of Agriculture & Farmers Welfare, Government of India");
        pmKisan.setCategory("Income Support");
        pmKisan.setBenefits("₹6,000 per year (3 instalments of ₹2,000 directly to bank account)");
        pmKisan.setEligibilityDescription("All landholding farmers' families having cultivable landholding in their names are eligible, subject to exclusion criteria (e.g. institutional landholders, active/retired government employees, income tax payers).");
        pmKisan.setOfficialUrl("https://pmkisan.gov.in/");
        pmKisan.setApplicationUrl("https://pmkisan.gov.in/RegistrationFormNew.aspx");
        pmKisan.setStateScope("ALL");
        pmKisan.setLastVerifiedAt(todayStr);
        pmKisan.setActive(true);
        pmKisan = schemeRepository.save(pmKisan);

        createRule(pmKisan, "Landholding Requirement", "farmSize", ">", "0.0", "Farmer must possess cultivable land holding", true);
        createRule(pmKisan, "State Registration", "state", "NOT_NULL", "", "Farmer must be registered in a valid Indian state", true);

        // 2. PMFBY (Pradhan Mantri Fasal Bima Yojana)
        GovernmentScheme pmfby = new GovernmentScheme();
        pmfby.setSchemeCode("PMFBY");
        pmfby.setSchemeName("Pradhan Mantri Fasal Bima Yojana (Crop Insurance)");
        pmfby.setShortDescription("Comprehensive crop insurance against non-preventable natural risks, pests & diseases from pre-sowing to post-harvest.");
        pmfby.setFullDescription("Pradhan Mantri Fasal Bima Yojana (PMFBY) aims to provide financial support to farmers suffering crop loss/damage arising out of non-preventable natural calamities. Farmers pay nominal premiums (2% for Kharif, 1.5% for Rabi, and 5% for commercial/horticultural crops), with the balance subsidized equally by Central and State Governments.");
        pmfby.setMinistry("Ministry of Agriculture & Farmers Welfare, Government of India");
        pmfby.setCategory("Crop Insurance");
        pmfby.setBenefits("Comprehensive insurance cover against crop loss; nominal premium of 1.5% to 5% with full government subsidy on balance premium.");
        pmfby.setEligibilityDescription("Available to all farmers including sharecroppers and tenant farmers growing notified crops in notified areas during the applicable season.");
        pmfby.setOfficialUrl("https://pmfby.gov.in/");
        pmfby.setApplicationUrl("https://pmfby.gov.in/farmerRegistrationForm");
        pmfby.setStateScope("ALL");
        pmfby.setLastVerifiedAt(todayStr);
        pmfby.setActive(true);
        pmfby = schemeRepository.save(pmfby);

        createRule(pmfby, "Notified Crop Production", "primaryCrops", "NOT_NULL", "", "Farmer grows agricultural crops eligible for notification", true);
        createRule(pmfby, "Notified Area Location", "district", "NOT_NULL", "", "District location is registered", true);

        // 3. PM-KUSUM
        GovernmentScheme pmKusum = new GovernmentScheme();
        pmKusum.setSchemeCode("PM-KUSUM");
        pmKusum.setSchemeName("PM-KUSUM (Solar Agricultural Pumps & Energy)");
        pmKusum.setShortDescription("Subsidies up to 60% for installation of standalone solar agriculture pumps and solarization of existing pumps.");
        pmKusum.setFullDescription("Pradhan Mantri Kisan Urja Suraksha evam Utthan Mahabhiyan (PM-KUSUM) consists of three components: Component-A (setting up small solar power plants on barren land), Component-B (installing standalone off-grid solar water pumps up to 7.5 HP with 60% subsidy), and Component-C (solarization of existing grid-connected agriculture pumps).");
        pmKusum.setMinistry("Ministry of New and Renewable Energy (MNRE), Government of India");
        pmKusum.setCategory("Solar Energy & Irrigation");
        pmKusum.setBenefits("Up to 60% subsidy (30% Central + 30% State) for standalone solar pumpsets and pump solarization.");
        pmKusum.setEligibilityDescription("Farmers, groups of farmers, panchayats, and cooperatives having agricultural land and irrigation pump requirements.");
        pmKusum.setOfficialUrl("https://pmkusum.mnre.gov.in/");
        pmKusum.setApplicationUrl("https://pmkusum.mnre.gov.in/");
        pmKusum.setStateScope("ALL");
        pmKusum.setLastVerifiedAt(todayStr);
        pmKusum.setActive(true);
        pmKusum = schemeRepository.save(pmKusum);

        createRule(pmKusum, "Agricultural Land Availability", "farmSize", ">=", "0.25", "Farmer has agricultural land for solar pump installation", true);
        createRule(pmKusum, "Irrigation Requirement", "farmingType", "NOT_NULL", "", "Farmer engages in active irrigated/organic agriculture", false);

        // 4. e-NAM
        GovernmentScheme eNam = new GovernmentScheme();
        eNam.setSchemeCode("E-NAM");
        eNam.setSchemeName("National Agriculture Market (e-NAM Platform)");
        eNam.setShortDescription("Pan-India electronic trading portal networking APMC mandis to create a unified national market for agricultural commodities.");
        eNam.setFullDescription("National Agriculture Market (e-NAM) is a pan-India electronic trading portal which networks existing APMC mandis to create a unified national market for agricultural commodities. It provides better price discovery through transparent bidding, real-time online payment directly to farmer bank accounts, and quality testing infrastructure.");
        eNam.setMinistry("Small Farmers Agribusiness Consortium (SFAC), Govt of India");
        eNam.setCategory("Marketplace & Trade");
        eNam.setBenefits("Transparent price discovery, direct online payment to bank account, access to national buyers across APMC mandis.");
        eNam.setEligibilityDescription("Open to all farmers selling agricultural produce, farmer producer organizations (FPOs), and licensed traders.");
        eNam.setOfficialUrl("https://www.enam.gov.in/");
        eNam.setApplicationUrl("https://www.enam.gov.in/web/dashboard/farmer-registration");
        eNam.setStateScope("ALL");
        eNam.setLastVerifiedAt(todayStr);
        eNam.setActive(true);
        eNam = schemeRepository.save(eNam);

        createRule(eNam, "Agricultural Produce", "primaryCrops", "NOT_NULL", "", "Farmer produces agricultural crops for trade", true);

        // 5. TN CM Solar Powered Pump Scheme & AGISNET
        GovernmentScheme tnAgri = new GovernmentScheme();
        tnAgri.setSchemeCode("TN-CM-SOLAR");
        tnAgri.setSchemeName("Tamil Nadu CM Solar Powered Pump Scheme & AGISNET");
        tnAgri.setShortDescription("Special 70% subsidy scheme by Government of Tamil Nadu for standalone solar pumpsets and agricultural mechanization.");
        tnAgri.setFullDescription("The Tamil Nadu Agricultural Department (AGISNET) provides up to 70% subsidy for off-grid solar pumpsets, drip irrigation systems, and farm machinery token allotment to small and marginal farmers in Tamil Nadu under the Chief Minister's Solar Pump Set Scheme and Sub-Mission on Agricultural Mechanization (SMAM).");
        tnAgri.setMinistry("Department of Agriculture & Farmers Welfare, Government of Tamil Nadu");
        tnAgri.setCategory("State Specific Subsidy");
        tnAgri.setBenefits("70% state subsidy for solar pumpsets, 100% micro-irrigation subsidy for small/marginal farmers, mechanized farm equipment tokens.");
        tnAgri.setEligibilityDescription("Farmers residing and cultivating agricultural land in Tamil Nadu districts (small and marginal farmers given priority).");
        tnAgri.setOfficialUrl("https://www.tnagrisnet.tn.gov.in/");
        tnAgri.setApplicationUrl("https://www.tnagrisnet.tn.gov.in/");
        tnAgri.setStateScope("Tamil Nadu");
        tnAgri.setLastVerifiedAt(todayStr);
        tnAgri.setActive(true);
        tnAgri = schemeRepository.save(tnAgri);

        createRule(tnAgri, "Tamil Nadu Residency", "state", "=", "Tamil Nadu", "Farmer must be located in Tamil Nadu state", true);
        createRule(tnAgri, "Cultivable Land", "farmSize", ">", "0.0", "Farmer holds agricultural land in Tamil Nadu", true);
    }

    private void createRule(GovernmentScheme scheme, String ruleName, String fieldName, String operator, String expectedValue, String description, boolean required) {
        SchemeEligibilityRule rule = new SchemeEligibilityRule();
        rule.setScheme(scheme);
        rule.setRuleName(ruleName);
        rule.setFieldName(fieldName);
        rule.setOperator(operator);
        rule.setExpectedValue(expectedValue);
        rule.setRuleDescription(description);
        rule.setRequired(required);
        ruleRepository.save(rule);
    }
}
