# ALL YOU NEED IS LOVE

## Project info

**URL**:(https://allyouneedislove.art/)

## How can I edit this code?

There are several ways of editing your application.

Love Terminal

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

import logging
import os
from dotenv import load_dotenv
from src.search_agent.providers.model_provider import ModelProvider
from src.search_agent.providers.search_provider import SearchProvider
from sentient_agent_framework import (
    AbstractAgent,
    DefaultServer,
    Session,
    Query,
    ResponseHandler)
from typing import AsyncIterator


load_dotenv()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


class SearchAgent(AbstractAgent):
    def __init__(
            self,
            name: str
    ):
        super().__init__(name)

        model_api_key = os.getenv("MODEL_API_KEY")
        if not model_api_key:
            raise ValueError("MODEL_API_KEY is not set")
        self._model_provider = ModelProvider(api_key=model_api_key)

        search_api_key = os.getenv("TAVILY_API_KEY")
        if not search_api_key:
            raise ValueError("TAVILY_API_KEY is not set") 
        self._search_provider = SearchProvider(api_key=search_api_key)


    # Implement the assist method as required by the AbstractAgent class
    async def assist(
            self,
            session: Session,
            query: Query,
            response_handler: ResponseHandler
    ):
        """Search the internet for information."""
        # Search for information
        await response_handler.emit_text_block(
            "SEARCH", "Searching internet for results..."
        )
        search_results = await self._search_provider.search(query.prompt)
        if len(search_results["results"]) > 0:
            # Use response handler to emit JSON to the client
            await response_handler.emit_json(
                "SOURCES", {"results": search_results["results"]}
            )
        if len(search_results["images"]) > 0:
            # Use response handler to emit JSON to the client
            await response_handler.emit_json(
                "IMAGES", {"images": search_results["images"]}
            )

        # Process search results
        # Use response handler to create a text stream to stream the final 
        # response to the client
        final_response_stream = response_handler.create_text_stream(
            "FINAL_RESPONSE"
            )
        async for chunk in self.__process_search_results(search_results["results"]):
            # Use the text stream to emit chunks of the final response to the client
            await final_response_stream.emit_chunk(chunk)
        # Mark the text stream as complete
        await final_response_stream.complete()
        # Mark the response as complete
        await response_handler.complete()
    

    async def __process_search_results(
            self, 
            search_results: dict
    ) -> AsyncIterator[str]:
        """Process the search results."""
        process_search_results_query = f"Summarise the following search results: {search_results}"
        async for chunk in self._model_provider.query_stream(process_search_results_query):
            yield chunk


if __name__ == "__main__":
    # Create an instance of a SearchAgent
    agent = SearchAgent(name="Search Agent")
    # Create a server to handle requests to the agent
    server = DefaultServer(agent)
    # Run the server
    server.run()

Deploy SuperAGI to DigitalOcean with one click.

🌐 Architecture
SuperAGI Architecture
Agent Architecture
Agent Workflow Architecture
Tools Architecture
ER Diagram

"""Resource Modified

Revision ID: 2f97c068fab9
Revises: a91808a89623
Create Date: 2023-06-02 13:13:21.670935

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2f97c068fab9'
down_revision = 'a91808a89623'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('resources', sa.Column('agent_id', sa.Integer(), nullable=True))
    op.drop_column('resources', 'project_id')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('resources', sa.Column('project_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_column('resources', 'agent_id')
    # ### end Alembic commands ###
