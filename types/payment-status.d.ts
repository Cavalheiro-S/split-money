type PaymentStatus = {
  id: string;
  description: string;
  created_at: string;
  updated_at: string;
};

type RequestCreatePaymentStatus = {
  description: string;
};

type RequestUpdatePaymentStatus = {
  id: string;
  description: string;
};
