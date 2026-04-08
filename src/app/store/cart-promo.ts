export type PromoType = 'percent' | 'fixed';

export type AppliedPromo = {
  code: string;
  type: PromoType;
  amount: number;
};

export type ApplyPromoResult =
  | {
      success: true;
      promo: AppliedPromo;
    }
  | {
      success: false;
      errorMessage: string;
    };

const promoDefinitions: Record<string, Omit<AppliedPromo, 'code'>> = {
  SALE10: {
    type: 'percent',
    amount: 10,
  },
  MINUS300: {
    type: 'fixed',
    amount: 300,
  },
};

export function normalizePromoCode(code: string) {
  return code.trim().toUpperCase();
}

export function resolvePromo(code: string): AppliedPromo | null {
  const normalizedCode = normalizePromoCode(code);
  const promo = promoDefinitions[normalizedCode];

  if (!promo) {
    return null;
  }

  return {
    code: normalizedCode,
    ...promo,
  };
}

export function calculatePromoDiscount(subtotal: number, appliedPromo: AppliedPromo | null) {
  if (!appliedPromo || subtotal <= 0) {
    return 0;
  }

  const rawDiscount =
    appliedPromo.type === 'percent'
      ? subtotal * (appliedPromo.amount / 100)
      : appliedPromo.amount;

  return Math.min(subtotal, rawDiscount);
}
