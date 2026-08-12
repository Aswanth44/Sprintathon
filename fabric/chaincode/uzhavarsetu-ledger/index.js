/*
 * UzhavarSetu Tamper-Evident Supply Chain Traceability Contract
 * Hyperledger Fabric Chaincode (Node.js)
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class UzhavarSetuLedgerContract extends Contract {

    async initLedger(ctx) {
        console.info('UzhavarSetu Ledger Chaincode Initialized');
    }

    /**
     * Creates an immutable supply chain event asset in Fabric state.
     * Keyed by eventId (e.g. EVT-001).
     */
    async CreateEvent(ctx, eventId, batchId, eventType, timestamp, actorId, actorRole, location, quantity, unit, description) {
        const exists = await this.EventExists(ctx, eventId);
        if (exists) {
            throw new Error(`The event ${eventId} already exists in the Fabric ledger.`);
        }

        const eventAsset = {
            docType: 'batchEvent',
            eventId,
            batchId,
            eventType: (eventType || 'HARVESTED').toUpperCase(),
            timestamp: timestamp || new Date().toISOString(),
            actorId: actorId || 'UZH-SYSTEM-001',
            actorRole: actorRole || 'SYSTEM',
            location: location || 'Coimbatore Region',
            quantity: parseInt(quantity, 10) || 500,
            unit: unit || 'kg',
            description: description || 'Supply chain event recorded on Hyperledger Fabric ledger',
            committedAt: new Date().toISOString()
        };

        await ctx.stub.putState(eventId, Buffer.from(JSON.stringify(eventAsset)));
        return JSON.stringify(eventAsset);
    }

    /**
     * Retrieves a single event by eventId.
     */
    async GetEvent(ctx, eventId) {
        const eventBytes = await ctx.stub.getState(eventId);
        if (!eventBytes || eventBytes.length === 0) {
            throw new Error(`The event ${eventId} does not exist in the Fabric ledger.`);
        }
        return eventBytes.toString();
    }

    /**
     * Checks if an event exists by eventId.
     */
    async EventExists(ctx, eventId) {
        const eventBytes = await ctx.stub.getState(eventId);
        return eventBytes && eventBytes.length > 0;
    }

    /**
     * Checks if any events exist for a batchId.
     */
    async BatchExists(ctx, batchId) {
        const allEvents = await this.GetBatchEvents(ctx, batchId);
        const parsed = JSON.parse(allEvents);
        return parsed && parsed.length > 0;
    }

    /**
     * Retrieves all events associated with a batchId.
     */
    async GetBatchEvents(ctx, batchId) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const allResults = [];

        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                let record;
                try {
                    record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    record = res.value.value.toString('utf8');
                }
                if (record.docType === 'batchEvent' && record.batchId === batchId) {
                    allResults.push(record);
                }
            }
            if (res.done) {
                await iterator.close();
                break;
            }
        }

        // Sort by timestamp or eventId order
        allResults.sort((a, b) => a.eventId.localeCompare(b.eventId));
        return JSON.stringify(allResults);
    }

    /**
     * Retrieves the latest event for a batchId.
     */
    async GetBatchLatestEvent(ctx, batchId) {
        const batchEventsStr = await this.GetBatchEvents(ctx, batchId);
        const events = JSON.parse(batchEventsStr);
        if (!events || events.length === 0) {
            throw new Error(`No Fabric ledger events found for batch ${batchId}`);
        }
        return JSON.stringify(events[events.length - 1]);
    }

    /**
     * Retrieves all batch events committed to the Fabric ledger.
     */
    async GetAllBatchEvents(ctx) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const allResults = [];

        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                let record;
                try {
                    record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    record = res.value.value.toString('utf8');
                }
                if (record.docType === 'batchEvent') {
                    allResults.push(record);
                }
            }
            if (res.done) {
                await iterator.close();
                break;
            }
        }
        return JSON.stringify(allResults);
    }
}

module.exports = UzhavarSetuLedgerContract;
