package com.uzhavarsetu.repository;

import com.uzhavarsetu.entity.BuyerOffer;
import com.uzhavarsetu.entity.ProduceBatch;
import com.uzhavarsetu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BuyerOfferRepository extends JpaRepository<BuyerOffer, Long> {

    List<BuyerOffer> findByFarmer(User farmer);

    List<BuyerOffer> findByFarmerId(Long farmerId);

    List<BuyerOffer> findByBuyer(User buyer);

    List<BuyerOffer> findByBuyerId(Long buyerId);

    List<BuyerOffer> findByBatch(ProduceBatch batch);

    Optional<BuyerOffer> findByOfferId(String offerId);

    long countByFarmer(User farmer);

    long countByFarmerAndStatus(User farmer, String status);
}
