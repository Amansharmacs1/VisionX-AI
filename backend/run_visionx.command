#!/bin/bash

# Navigate to the backend directory
cd "$(dirname "$0")"

# Initialize conda for this script
source /opt/anaconda3/etc/profile.d/conda.sh

# Activate the environment
conda activate visionx

# Run the project
python main.py
