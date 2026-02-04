# OptiBio "Work on Later" Backlog

**Created:** February 3, 2026  
**Purpose:** Track all deferred items that are valuable but not required for launch.

---

## Backlog Overview

This document contains all items that have been intentionally deferred to post-launch. These items represent optimization and scaling features that become relevant as the business grows.

**Total Deferred Items:** 14  
**Estimated Implementation Time:** 40-60 hours total  
**Trigger:** Implement when specific growth milestones are reached

---

## 🟢 Deferred Items by Category

### Category 1: Advanced Financial Operations

| ID | Item | Source | Trigger Condition | Est. Hours |
|----|------|--------|-------------------|------------|
| WOL-001 | **Backup Payment Gateway (NMI)** - Dormant gateway ready to activate if Stripe freezes funds | Digital 12 | Revenue > $50K/month OR Stripe warning | 8 |
| WOL-002 | **Unit Economics 2.0** - Calculate "True Profit" after refunds and chargebacks | Digital 12 | 30+ days of sales data | 4 |
| WOL-003 | **Sales Tax Nexus Automation** - Auto-configure TaxJar/Avalara for new states | Digital 12 | Approaching nexus thresholds in any state | 6 |

### Category 2: Advanced Operations & Infrastructure

| ID | Item | Source | Trigger Condition | Est. Hours |
|----|------|--------|-------------------|------------|
| WOL-004 | **Disaster Recovery Protocol** - "Break glass" plan for Stripe freeze, server failure | Digital 12 | After 2 weeks of stable operations | 8 |
| WOL-005 | **Failover Handling** - Server redundancy for high traffic | Digital 12 | Daily traffic > 10,000 visitors | 12 |
| WOL-006 | **Manufacturer Liaison System** - Track lead times for KSM-66 ingredients | Digital 12 | When placing second inventory order | 4 |
| WOL-007 | **60-Day Stock Forecasting** - Predict stockouts based on ad spend velocity | Digital 12 | 30+ days of sales velocity data | 6 |

### Category 3: Advanced Customer Success

| ID | Item | Source | Trigger Condition | Est. Hours |
|----|------|--------|-------------------|------------|
| WOL-008 | **Anti-Churn Flows** - Pre-renewal warning emails for subscriptions | Digital 12 | When subscription feature launches | 4 |
| WOL-009 | **Win-Back Sequences** - Re-engage lapsed customers | Council of 8 | 60+ days of customer data | 4 |
| WOL-010 | **Photo Review Solicitation** - Request photos with reviews | Digital 12 | After 50+ text reviews collected | 3 |

### Category 4: Advanced Returns & Refunds

| ID | Item | Source | Trigger Condition | Est. Hours |
|----|------|--------|-------------------|------------|
| WOL-011 | **Auto-Approve Refunds < $50** - Automatic approval for small refunds | Digital 12 | After refund patterns emerge (30+ refunds) | 4 |
| WOL-012 | **Pre-Paid Return Label Generation** - Automatic return shipping labels | Digital 12 | Return volume > 10/week | 4 |
| WOL-013 | **Reverse Logistics System** - Full RMA workflow | Digital 12 | Return volume > 50/month | 8 |

### Category 5: Advanced Compliance

| ID | Item | Source | Trigger Condition | Est. Hours |
|----|------|--------|-------------------|------------|
| WOL-014 | **COA & GMP Batch Audit System** - Match Certificates of Analysis to inventory batches | Digital 12 | Managing multiple product batches | 6 |

---

## Implementation Priority Queue

When triggers are met, implement in this order:

### High Value / Low Effort (Do First)
1. WOL-002: Unit Economics 2.0 (4 hours)
2. WOL-010: Photo Review Solicitation (3 hours)
3. WOL-009: Win-Back Sequences (4 hours)

### High Value / Medium Effort (Do Second)
4. WOL-004: Disaster Recovery Protocol (8 hours)
5. WOL-003: Sales Tax Nexus Automation (6 hours)
6. WOL-007: 60-Day Stock Forecasting (6 hours)

### Medium Value / Medium Effort (Do Third)
7. WOL-001: Backup Payment Gateway (8 hours)
8. WOL-008: Anti-Churn Flows (4 hours)
9. WOL-006: Manufacturer Liaison System (4 hours)

### Lower Priority (Do When Needed)
10. WOL-011: Auto-Approve Refunds (4 hours)
11. WOL-012: Pre-Paid Return Labels (4 hours)
12. WOL-013: Reverse Logistics System (8 hours)
13. WOL-014: COA Batch Audit (6 hours)
14. WOL-005: Failover Handling (12 hours)

---

## Tracking Template

Use this template to track progress:

```markdown
### WOL-XXX: [Item Name]
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Complete
- **Trigger Met:** [Date]
- **Started:** [Date]
- **Completed:** [Date]
- **Notes:** [Any implementation notes]
```

---

## Current Status

| ID | Item | Status | Trigger Met |
|----|------|--------|-------------|
| WOL-001 | Backup Payment Gateway | ⬜ Not Started | No |
| WOL-002 | Unit Economics 2.0 | ⬜ Not Started | No |
| WOL-003 | Sales Tax Nexus | ⬜ Not Started | No |
| WOL-004 | Disaster Recovery | ⬜ Not Started | No |
| WOL-005 | Failover Handling | ⬜ Not Started | No |
| WOL-006 | Manufacturer Liaison | ⬜ Not Started | No |
| WOL-007 | Stock Forecasting | ⬜ Not Started | No |
| WOL-008 | Anti-Churn Flows | ⬜ Not Started | No |
| WOL-009 | Win-Back Sequences | ⬜ Not Started | No |
| WOL-010 | Photo Reviews | ⬜ Not Started | No |
| WOL-011 | Auto-Approve Refunds | ⬜ Not Started | No |
| WOL-012 | Return Labels | ⬜ Not Started | No |
| WOL-013 | Reverse Logistics | ⬜ Not Started | No |
| WOL-014 | COA Batch Audit | ⬜ Not Started | No |

---

## Notes

- This backlog should be reviewed monthly
- Trigger conditions should be monitored via analytics dashboard
- Some items may become urgent based on business events (e.g., Stripe warning triggers WOL-001)
- Estimated hours are for initial implementation; ongoing maintenance is separate

---

*Last Updated: February 3, 2026*
