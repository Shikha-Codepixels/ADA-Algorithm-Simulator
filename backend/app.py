from flask import Flask, request, jsonify
from flask_cors import CORS 
import subprocess
import json
import os

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "AlgoViz Backend Running"


@app.route("/api/merge-sort", methods=["POST"])
def merge_sort():

    data = request.get_json()

    if not data or "array" not in data:
        return jsonify({
            "error": "Array is required"
        }), 400


    array = data["array"]

    if not isinstance(array, list) or len(array) == 0:
        return jsonify({
            "error": "Array must contain numbers"
        }), 400


    project_root = os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )

    executable = os.path.join(
        project_root,
        "merge_sort.exe"
    )


    if not os.path.exists(executable):

        return jsonify({
            "error": "merge_sort.exe not found"
        }), 500


    cpp_input = (
        str(len(array))
        + "\n"
        + " ".join(map(str, array))
        + "\n"
    )


    try:

        result = subprocess.run(
            [executable],
            input=cpp_input,
            text=True,
            capture_output=True
        )


        if result.returncode != 0:

            return jsonify({
                "error": result.stderr
            }), 500


        output = result.stdout.strip()

        steps = json.loads(output)


        return jsonify({
            "steps": steps
        })


    except json.JSONDecodeError:

        return jsonify({
            "error": "C++ returned invalid JSON",
            "output": output
        }), 500


    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

@app.route("/api/quick-sort", methods=["POST"])
def quick_sort():

    data = request.get_json()

    if not data or "array" not in data:
        return jsonify({
            "error": "Array is required"
        }), 400

    array = data["array"]

    if not isinstance(array, list) or len(array) == 0:
        return jsonify({
            "error": "Array must contain numbers"
        }), 400

    project_root = os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )

    executable = os.path.join(
        project_root,
        "quick_sort.exe"
    )

    if not os.path.exists(executable):

        return jsonify({
            "error": "quick_sort.exe not found"
        }), 500

    cpp_input = (
        str(len(array))
        + "\n"
        + " ".join(map(str, array))
        + "\n"
    )

    try:

        result = subprocess.run(
            [executable],
            input=cpp_input,
            text=True,
            capture_output=True
        )

        if result.returncode != 0:

            return jsonify({
                "error": result.stderr
            }), 500

        output = result.stdout.strip()

        steps = json.loads(output)

        return jsonify({
            "steps": steps
        })

    except json.JSONDecodeError:

        return jsonify({
            "error": "C++ returned invalid JSON",
            "output": output
        }), 500

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
    

@app.route("/api/knapsack", methods=["POST"])
def knapsack():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request data is required"
        }), 400

    weights = data.get("weights")
    values = data.get("values")
    capacity = data.get("capacity")

    if not isinstance(weights, list) or not isinstance(values, list):
        return jsonify({
            "error": "Weights and values must be lists"
        }), 400

    if len(weights) != len(values):
        return jsonify({
            "error": "Weights and values must have equal lengths"
        }), 400

    if any(type(x) is not int for x in weights + values):
        return jsonify({
            "error": "Weights and values must contain integers"
        }), 400

    if any(w < 0 for w in weights):
        return jsonify({
            "error": "Weights cannot be negative"
        }), 400

    if type(capacity) is not int or capacity < 0:
        return jsonify({
            "error": "Capacity must be a non-negative integer"
        }), 400

    project_root = os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )

    executable = os.path.join(
        project_root,
        "knapsack.exe"
    )

    if not os.path.exists(executable):
        return jsonify({
            "error": "knapsack.exe not found"
        }), 500

    cpp_input = (
        str(len(weights)) + "\n"
        + " ".join(map(str, weights)) + "\n"
        + " ".join(map(str, values)) + "\n"
        + str(capacity) + "\n"
    )

    try:

        result = subprocess.run(
            [executable],
            input=cpp_input,
            text=True,
            capture_output=True
        )

        if result.returncode != 0:
            return jsonify({
                "error": result.stderr
            }), 500

        output = result.stdout.strip()
        steps = json.loads(output)

        return jsonify({
            "steps": steps
        })

    except json.JSONDecodeError:
        return jsonify({
            "error": "C++ returned invalid JSON",
            "output": output
        }), 500

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )