import { spawn }                              from "child_process";
import path                                   from "path";
import { PredictionInput, PredictionResult } from "./interfaceML";

const ML_DIR        = path.join(process.cwd(), "lib", "ml");
const PYTHON_SCRIPT = path.join(ML_DIR, "predict.py");

const PYTHON_BIN = process.platform === "win32"
  ? path.join(ML_DIR, "venv", "Scripts", "python.exe")
  : path.join(ML_DIR, "venv", "bin", "python3");

export async function runPrediction(
  inputs: PredictionInput[]
): Promise<PredictionResult[]> {
  return new Promise((resolve, reject) => {
    const proc = spawn(PYTHON_BIN, [PYTHON_SCRIPT]);

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (chunk: Buffer) => { stdout += chunk.toString(); });
    proc.stderr.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });

    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${stderr}`));
        return;
      }

      try {
        const parsed = JSON.parse(stdout.trim());

        if (parsed.error) {
          reject(new Error(parsed.error));
          return;
        }

        resolve(parsed as PredictionResult[]);
      } catch {
        reject(new Error(`Failed to parse Python output: ${stdout}`));
      }
    });

    proc.stdin.write(JSON.stringify(inputs));
    proc.stdin.end();
  });
}