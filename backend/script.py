import requests
import random

# Base URL for the API
BASE_URL = "http://127.0.0.1:8000/api/reviews/reviews/"
# Bearer token for authentication
AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM3MjQ1MzgzLCJpYXQiOjE3MzY2NDA1ODMsImp0aSI6IjNmYmY3YTgwNDM5NDRkMjc5NDRhNGMwNWJiNTM3ZWY4IiwidXNlcl9pZCI6Mn0.09MBYqWRhqXRlBL2PTaMKmfxLK0d7q3k-OU5bCQ5plE"


REVIEW_COMMENTS = [
    "Excellent guidance and extremely professional!",
    "Great insights into wealth management strategies.",
    "Very knowledgeable and thorough with their approach.",
    "Helped me understand complex tax issues effectively.",
    "Provided outstanding advice on portfolio optimization.",
    "Very patient and detailed in explanations.",
    "Helped me create a robust financial plan for retirement.",
    "Simplified my investment strategies and saved me money.",
    "Exceptional understanding of market trends and risks.",
    "Provided actionable steps to improve my finances.",
    "Professional and friendly service throughout.",
    "Answered all my questions and exceeded expectations.",
    "Gave valuable insights into real estate investments.",
    "Super helpful and explained everything in detail.",
    "Helped me structure my taxes to maximize savings.",
    "Very supportive and attentive to my financial needs.",
    "The advice was practical and easy to implement.",
    "Helped me navigate startup financial planning seamlessly.",
    "Efficient and professional service for estate planning.",
    "Taught me how to diversify my portfolio effectively.",
    "Improved my understanding of ETF management.",
    "Clarified my doubts regarding compliance issues.",
    "Highly recommend for anyone looking for budgeting help.",
    "Made the financial planning process stress-free.",
    "Offered great ideas for growth strategy implementation.",
    "Excellent communication and timely follow-ups.",
    "Provided me with a clear roadmap for my investments.",
    "A true expert in financial modeling and forecasting.",
    "Understood my unique financial challenges perfectly.",
    "Always approachable and willing to clarify doubts.",
    "Helped me streamline my business financials efficiently.",
    "Focused on finding the best strategies for my needs.",
    "Offered clear explanations for every recommendation.",
    "Really happy with the tax-saving advice provided.",
    "They helped me reduce unnecessary expenses drastically.",
    "Very strategic and detail-oriented in their approach.",
    "Explained the intricacies of asset allocation thoroughly.",
    "Exceptional at creating personalized financial plans.",
    "Guided me through critical business risk assessments.",
    "Saved me hours of stress during tax filing season.",
    "Delivered results beyond my expectations. Highly recommend!",
    "Very professional and accommodating of my needs.",
    "Impressed by their deep knowledge of venture capital.",
    "Helped secure funding for my startup effortlessly.",
    "Simplified the process of understanding compliance.",
    "The advice was actionable and delivered on time.",
    "Focused on building a financial plan that suited me.",
    "Super thorough with their analysis of my finances.",
    "Made retirement planning simple and achievable for me.",
    "Tailored the recommendations to match my goals.",
    "Helped resolve all my financial queries promptly.",
    "Provided clarity on tax laws and legal compliance.",
    "Offered practical steps for long-term wealth creation.",
    "Fantastic job in explaining REIT investment options.",
    "Helped us save on our business tax filings significantly.",
    "A true partner in navigating financial complexities.",
    "Really good at breaking down financial jargon.",
    "Appreciate their commitment to solving my issues.",
    "Excellent communicator and problem-solver.",
    "Made my startup valuation process seamless.",
    "Guided me in preparing for market uncertainties.",
    "Provided holistic advice on insurance planning.",
    "Ensured all my investments were tax-optimized.",
    "Reliable, experienced, and great to work with!",
    "Helped uncover hidden financial opportunities.",
    "Gave practical advice for estate planning strategies.",
    "Transformed the way I think about money management.",
    "Clear and well-structured approach to my finances.",
    "Always available for follow-ups and clarifications.",
    "Guided me in setting achievable savings goals.",
    "Amazed by their expertise in SaaS financial modeling.",
    "Provided me with step-by-step guidance on compliance.",
    "Deeply impressed by their market analysis skills.",
    "Helped create an actionable budget that works.",
    "Provided valuable insights into portfolio rebalancing.",
    "Explained how to mitigate risks effectively.",
    "The best financial advisor I've worked with so far.",
    "Appreciate their consistent attention to detail.",
    "Guided me through the process of REIT investments.",
    "Offered timely recommendations to protect my assets.",
    "Streamlined the tax filing process effortlessly.",
    "Always provided actionable and timely advice.",
    "Broke down complex tax laws into simple steps.",
    "Strongly recommend for anyone planning their retirement.",
    "Went above and beyond to address my concerns.",
    "Offered excellent guidance for estate planning.",
    "Very transparent about the fee structure and processes.",
    "Provided creative solutions to meet my financial goals.",
    "Helped structure my debt repayment plan effectively.",
    "Great knowledge about mergers and acquisitions.",
    "Helped me implement a growth strategy for my business.",
    "Very methodical in approach and highly professional.",
    "Transformed how I approach my monthly budgeting.",
    "Created financial stability during uncertain times.",
    "The recommendations were spot-on and timely.",
    "Helped me overcome my financial fears step by step.",
    "The insights provided were truly eye-opening.",
    "Helped balance my long-term and short-term goals.",
    "Highly knowledgeable about compliance frameworks.",
    "Appreciate the personalized approach to finances.",
    "Outstanding advisor for handling business challenges.",
    "Expertly guided me through a major financial decision.",
    "Provided a clear roadmap for paying off debts."
]


# Experts to post reviews for
EXPERT_IDS = [i for i in range(3, 31) if i != 2]

# Function to post reviews
def post_reviews():
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {AUTH_TOKEN}",
    }
    
    for expert_id in EXPERT_IDS:
        num_reviews = random.randint(5, 6)  # Randomly choose 5-6 reviews per expert
        selected_reviews = random.sample(REVIEW_COMMENTS, num_reviews)
        for review in selected_reviews:
            payload = {
                "expert": expert_id,
                "rating": random.randint(3, 5),
                "comment": review,
            }
            response = requests.post(BASE_URL, json=payload, headers=headers)
            if response.status_code == 201:
                print(f"Review for expert {expert_id} posted successfully!")
            else:
                print(f"Failed to post review for expert {expert_id}. Response: {response.text}")

if __name__ == "__main__":
    post_reviews()
