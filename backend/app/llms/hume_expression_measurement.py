from hume import HumeBatchClient
from hume.models.config import ProsodyConfig
import os
from dotenv import load_dotenv

load_dotenv()

client = HumeBatchClient(api_key=os.getenv("HUME_API_KEY"))
config = ProsodyConfig()


def get_prosody(filepaths: list[str]):
    job = client.submit_job(None, [config], files=filepaths)
    print(job)
    print("Running...")
    details = job.await_complete()
    job.download_predictions("media/predictions.json")
    print("Predictions downloaded to media/predictions.json")


if __name__ == "__main__":
    get_prosody(["media/hume_script.m4a"])
