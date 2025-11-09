import boto3
import os
from dotenv import load_dotenv

# Set the API key as an environment variable
load_dotenv()

access_key = os.getenv("AWS_ACCESS_KEY_ID")
secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
region = os.getenv("AWS_REGION")

# Create the Bedrock client
client = boto3.client(
    service_name = "bedrock-runtime",
    region_name = region,
    aws_access_key_id=access_key,
    aws_secret_access_key=secret_key
)

# Define the model and message
model_id = "us.anthropic.claude-3-5-haiku-20241022-v1:0"
messages = [{"role": "user", "content": [{"text": "Hello! Can you tell me about Amazon Bedrock?"}]}]

# Make the API call
response = client.converse(
    modelId=model_id,
    messages=messages,
)

# Print the response
print(response['output']['message']['content'][0]['text'])