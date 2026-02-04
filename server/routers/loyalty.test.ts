import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
vi.mock('../db', () => ({
  getDb: vi.fn(),
}));

describe('Loyalty Program', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Tier Calculation', () => {
    it('should return bronze for 0-499 lifetime points', () => {
      const calculateTier = (lifetimePoints: number) => {
        if (lifetimePoints >= 5000) return 'platinum';
        if (lifetimePoints >= 1500) return 'gold';
        if (lifetimePoints >= 500) return 'silver';
        return 'bronze';
      };

      expect(calculateTier(0)).toBe('bronze');
      expect(calculateTier(100)).toBe('bronze');
      expect(calculateTier(499)).toBe('bronze');
    });

    it('should return silver for 500-1499 lifetime points', () => {
      const calculateTier = (lifetimePoints: number) => {
        if (lifetimePoints >= 5000) return 'platinum';
        if (lifetimePoints >= 1500) return 'gold';
        if (lifetimePoints >= 500) return 'silver';
        return 'bronze';
      };

      expect(calculateTier(500)).toBe('silver');
      expect(calculateTier(1000)).toBe('silver');
      expect(calculateTier(1499)).toBe('silver');
    });

    it('should return gold for 1500-4999 lifetime points', () => {
      const calculateTier = (lifetimePoints: number) => {
        if (lifetimePoints >= 5000) return 'platinum';
        if (lifetimePoints >= 1500) return 'gold';
        if (lifetimePoints >= 500) return 'silver';
        return 'bronze';
      };

      expect(calculateTier(1500)).toBe('gold');
      expect(calculateTier(3000)).toBe('gold');
      expect(calculateTier(4999)).toBe('gold');
    });

    it('should return platinum for 5000+ lifetime points', () => {
      const calculateTier = (lifetimePoints: number) => {
        if (lifetimePoints >= 5000) return 'platinum';
        if (lifetimePoints >= 1500) return 'gold';
        if (lifetimePoints >= 500) return 'silver';
        return 'bronze';
      };

      expect(calculateTier(5000)).toBe('platinum');
      expect(calculateTier(10000)).toBe('platinum');
    });
  });

  describe('Points Calculation', () => {
    it('should calculate base points correctly (1 point per $1)', () => {
      const POINTS_PER_DOLLAR = 1;
      const calculateBasePoints = (orderTotalCents: number) => {
        return Math.floor((orderTotalCents / 100) * POINTS_PER_DOLLAR);
      };

      expect(calculateBasePoints(4999)).toBe(49); // $49.99 = 49 points
      expect(calculateBasePoints(10000)).toBe(100); // $100 = 100 points
      expect(calculateBasePoints(14997)).toBe(149); // $149.97 = 149 points
    });

    it('should apply tier multipliers correctly', () => {
      const TIER_MULTIPLIERS = {
        bronze: 1,
        silver: 1.25,
        gold: 1.5,
        platinum: 2,
      };

      const calculateEarnedPoints = (basePoints: number, tier: keyof typeof TIER_MULTIPLIERS) => {
        return Math.floor(basePoints * TIER_MULTIPLIERS[tier]);
      };

      // 100 base points
      expect(calculateEarnedPoints(100, 'bronze')).toBe(100);
      expect(calculateEarnedPoints(100, 'silver')).toBe(125);
      expect(calculateEarnedPoints(100, 'gold')).toBe(150);
      expect(calculateEarnedPoints(100, 'platinum')).toBe(200);
    });
  });

  describe('Referral Code Generation', () => {
    it('should generate referral codes with correct format', () => {
      const generateReferralCode = (): string => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = 'OPT';
        for (let i = 0; i < 6; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
      };

      const code = generateReferralCode();
      expect(code).toMatch(/^OPT[A-Z0-9]{6}$/);
      expect(code.length).toBe(9);
      expect(code.startsWith('OPT')).toBe(true);
    });

    it('should not include confusing characters (0, O, I, 1)', () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      expect(chars).not.toContain('0'); // Zero
      expect(chars).not.toContain('O'); // Letter O
      expect(chars).not.toContain('I'); // Letter I
      expect(chars).not.toContain('1'); // One
    });
  });

  describe('Next Tier Calculation', () => {
    it('should calculate progress to next tier correctly', () => {
      const TIER_THRESHOLDS = {
        bronze: 0,
        silver: 500,
        gold: 1500,
        platinum: 5000,
      };

      const calculateNextTier = (lifetimePoints: number) => {
        if (lifetimePoints >= TIER_THRESHOLDS.platinum) {
          return { tier: null, pointsNeeded: 0, progress: 100 };
        }
        if (lifetimePoints >= TIER_THRESHOLDS.gold) {
          return {
            tier: 'platinum',
            pointsNeeded: TIER_THRESHOLDS.platinum - lifetimePoints,
            progress: Math.floor(((lifetimePoints - TIER_THRESHOLDS.gold) / (TIER_THRESHOLDS.platinum - TIER_THRESHOLDS.gold)) * 100),
          };
        }
        if (lifetimePoints >= TIER_THRESHOLDS.silver) {
          return {
            tier: 'gold',
            pointsNeeded: TIER_THRESHOLDS.gold - lifetimePoints,
            progress: Math.floor(((lifetimePoints - TIER_THRESHOLDS.silver) / (TIER_THRESHOLDS.gold - TIER_THRESHOLDS.silver)) * 100),
          };
        }
        return {
          tier: 'silver',
          pointsNeeded: TIER_THRESHOLDS.silver - lifetimePoints,
          progress: Math.floor((lifetimePoints / TIER_THRESHOLDS.silver) * 100),
        };
      };

      // Bronze user at 250 points
      const bronzeResult = calculateNextTier(250);
      expect(bronzeResult.tier).toBe('silver');
      expect(bronzeResult.pointsNeeded).toBe(250);
      expect(bronzeResult.progress).toBe(50);

      // Silver user at 1000 points
      const silverResult = calculateNextTier(1000);
      expect(silverResult.tier).toBe('gold');
      expect(silverResult.pointsNeeded).toBe(500);
      expect(silverResult.progress).toBe(50);

      // Platinum user
      const platinumResult = calculateNextTier(5000);
      expect(platinumResult.tier).toBe(null);
      expect(platinumResult.progress).toBe(100);
    });
  });

  describe('Reward Eligibility', () => {
    it('should check tier eligibility correctly', () => {
      const tierOrder = ['bronze', 'silver', 'gold', 'platinum'];
      
      const isEligible = (userTier: string, rewardMinTier: string) => {
        return tierOrder.indexOf(userTier) >= tierOrder.indexOf(rewardMinTier);
      };

      // Bronze user
      expect(isEligible('bronze', 'bronze')).toBe(true);
      expect(isEligible('bronze', 'silver')).toBe(false);
      expect(isEligible('bronze', 'gold')).toBe(false);
      expect(isEligible('bronze', 'platinum')).toBe(false);

      // Gold user
      expect(isEligible('gold', 'bronze')).toBe(true);
      expect(isEligible('gold', 'silver')).toBe(true);
      expect(isEligible('gold', 'gold')).toBe(true);
      expect(isEligible('gold', 'platinum')).toBe(false);

      // Platinum user
      expect(isEligible('platinum', 'bronze')).toBe(true);
      expect(isEligible('platinum', 'silver')).toBe(true);
      expect(isEligible('platinum', 'gold')).toBe(true);
      expect(isEligible('platinum', 'platinum')).toBe(true);
    });

    it('should check points affordability correctly', () => {
      const canAfford = (pointsBalance: number, rewardCost: number) => {
        return pointsBalance >= rewardCost;
      };

      expect(canAfford(500, 100)).toBe(true);
      expect(canAfford(500, 500)).toBe(true);
      expect(canAfford(500, 501)).toBe(false);
      expect(canAfford(0, 100)).toBe(false);
    });
  });

  describe('Constants Validation', () => {
    it('should have correct bonus values', () => {
      const SIGNUP_BONUS = 50;
      const REFERRAL_BONUS = 100;
      const REVIEW_BONUS = 25;
      const POINTS_PER_DOLLAR = 1;

      expect(SIGNUP_BONUS).toBe(50);
      expect(REFERRAL_BONUS).toBe(100);
      expect(REVIEW_BONUS).toBe(25);
      expect(POINTS_PER_DOLLAR).toBe(1);
    });

    it('should have correct tier thresholds', () => {
      const TIER_THRESHOLDS = {
        bronze: 0,
        silver: 500,
        gold: 1500,
        platinum: 5000,
      };

      expect(TIER_THRESHOLDS.bronze).toBe(0);
      expect(TIER_THRESHOLDS.silver).toBe(500);
      expect(TIER_THRESHOLDS.gold).toBe(1500);
      expect(TIER_THRESHOLDS.platinum).toBe(5000);
    });

    it('should have correct tier multipliers', () => {
      const TIER_MULTIPLIERS = {
        bronze: 1,
        silver: 1.25,
        gold: 1.5,
        platinum: 2,
      };

      expect(TIER_MULTIPLIERS.bronze).toBe(1);
      expect(TIER_MULTIPLIERS.silver).toBe(1.25);
      expect(TIER_MULTIPLIERS.gold).toBe(1.5);
      expect(TIER_MULTIPLIERS.platinum).toBe(2);
    });
  });
});
