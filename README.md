VectorShift Pipeline Builder
Build and analyze AI pipelines interactively. Validate structure, detect cycles, and explore Node-based workflows visually in React and FastAPI.

🚀 Overview
VectorShift Pipeline Builder lets you visually create, connect, and analyze data pipelines with drag-and-drop nodes. The backend validates pipeline structure, counts nodes and edges, and checks for cycles (DAG validation).

Frontend: Modern React (with ReactFlow, Zustand) for fast, interactive diagram editing.

Backend: FastAPI Python server for pipeline analysis and DAG validation.

🛠️ Features
Node-based Pipeline Editor — Drag-and-drop interface for designing workflows.

Text Node Variables — Dynamic handles for {{variable}} detection in text.

Backend API — Fast analysis of pipelines; responds with stats and DAG status.

DAG Detection — Warns if there are cycles in your pipeline.

Responsive Design — Always-visible submit and intuitive UI.

Detailed Feedback — Real-time alert shows nodes/edges and DAG result after submit.

📦 Installation & Local Setup
1. Clone the Repo
text
git clone https://github.com/your-username/vectorshift-pipeline-builder.git
cd vectorshift-pipeline-builder
2. Setup Backend
text
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
3. Setup Frontend
text
cd ../frontend
npm install
npm start
Frontend: http://localhost:3000

Backend API: http://localhost:8000

💡 Usage
Add nodes by dragging from the left toolbar.

Connect nodes to form your pipeline (edges).

Edit Text nodes — Type {{variable}} inside to create input handles.

Click "Submit" to send pipeline data to the backend.

Review analysis — an alert will display node/edge counts and DAG validity.

🧩 API Docs
POST /pipelines/parse

Request: { nodes: [...], edges: [...] }

Response: { num_nodes, num_edges, is_dag /* plus details */ }

See interactive docs at http://localhost:8000/docs

🏗️ Contributing
Pull requests and suggestions welcome!

Open issues

See CONTRIBUTING.md for guidelines

👥 Credits
Frontend by Your Name

Backend by Your Name

Tutorials, references:

VectorShift Tutorials

ReactFlow

FastAPI

📄 License
Distributed under the MIT License. See LICENSE for details.
