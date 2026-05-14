#!/usr/bin/env python33
"""maestro_runner.py - Execute Maestro E2E flows from Hermes (Python wrapper)"""
import subprocess, sys, os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
FLOWS_DIR = os.path.join(ROOT, "tests", "e2e", "flows")

FLOW_MAP = {
    "all": None,
    "signin": "signin.flow.yaml",
    "explore": "explore_map.flow.yaml",
    "plan": "plan_details.flow.yaml",
    "checkin": "checkin.flow.yaml",
    "profile": "profile.flow.yaml",
}

if len(sys.argv) < 2:
    print("Usage: python scripts/auto/maestro_runner.py [all|signin|explore|plan|checkin|profile]")
    sys.exit(1)

key = sys.argv[1]
if key not in FLOW_MAP:
    print(f"Unknown flow: {key}. Choices: {', '.join(FLOW_MAP.keys())}")
    sys.exit(1)

flow_file = FLOW_MAP[key]
cmd = ["maestro", "test", FLOWS_DIR]
if flow_file:
    cmd.append(flow_file)

print(f"Running Maestro: {' '.join(cmd)}")
result = subprocess.run(cmd, cwd=ROOT)
sys.exit(result.returncode)
