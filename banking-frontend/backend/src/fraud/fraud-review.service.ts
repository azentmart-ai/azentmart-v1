import { Injectable } from '@nestjs/common';

@Injectable()
export class FraudReviewService {
  private reviews: any[] = [];

  createReview(
    customerId: string,
    amount: number,
    riskScore: number,
    signals: string[],
  ) {
    const reviewId = `FR${Date.now()}`;

    const review = {
      reviewId,
      customerId,
      amount,
      riskScore,
      signals,
      status: 'PENDING_REVIEW',
      createdAt: new Date().toISOString(),
    };

    this.reviews.push(review);

    return {
      success: true,
      review,
      message: 'Transaction sent for fraud review.',
    };
  }

  getPendingReviews() {
    return {
      success: true,
      reviews: this.reviews.filter(
        review => review.status === 'PENDING_REVIEW',
      ),
    };
  }
  approveReview(reviewId: string) {
  const review = this.reviews.find(
    r => r.reviewId === reviewId,
  );

  if (!review) {
    return {
      success: false,
      message: 'Fraud review not found',
    };
  }

  review.status = 'APPROVED';
  review.reviewedAt = new Date().toISOString();

  return {
    success: true,
    review,
    message: 'Transaction approved after fraud review.',
  };
}
getReview(reviewId: string) {
  const review = this.reviews.find(
    r => r.reviewId === reviewId,
  );

  if (!review) {
    return {
      success: false,
      message: 'Fraud review not found',
    };
  }

  return {
    success: true,
    review,
  };
}

}