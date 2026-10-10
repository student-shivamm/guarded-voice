# Guarded Voice

Guarded Voice contains a React/TanStack Start web interface and a separate Colab notebook exploring audio deepfake classification with MFCC features and an SVM. The notebook does not provide a web inference server or a speaker-verification model.

## Web interface

The repository includes `package.json` and `bun.lock`. With Bun installed, run from the repository root:

```sh
bun install --frozen-lockfile
bun run dev
```

Open the address printed by Vite. Other available checks are `bun run build` and `bun run lint`; there is no test script. The install option follows the [Bun documentation](https://bun.sh/docs/pm/cli/install). These commands have not yet been verified against a clean install of this repository.

Without `VITE_API_BASE_URL`, `src/services/api.ts` returns random demo predictions and scores. They do not analyze the uploaded audio and should not be presented as model accuracy or confidence.

For a separately implemented backend, set `VITE_API_BASE_URL` in a local `.env` file before starting Vite. It must accept these multipart POST requests and return JSON:

| Endpoint | Form fields | Expected result |
| --- | --- | --- |
| `/api/detect-deepfake` | `audio` | `prediction` (`REAL` or `DEEPFAKE`), numeric `confidence` |
| `/api/verify-speaker` | `suspicious_audio`, `reference_audio` | boolean `match`, numeric `similarity` |

See `src/services/api.ts` and `src/types/api.ts`. A backend on a different origin must permit requests from the frontend origin. Never put credentials in a `VITE_` variable; those values are exposed to the client.

## Notebook baseline

Open [DEEPFAKE_DETECTION.ipynb](DEEPFAKE_DETECTION.ipynb) in Google Colab. Cell numbers below are **zero-based**, including the opening badge cell. The notebook contains interactive uploads, multiple retraining paths, and destructive preprocessing; do not use Run All.

1. Review the [DEEP-VOICE dataset page](https://www.kaggle.com/datasets/birdy654/deep-voice-deepfake-voice-recognition), its license and access terms before downloading. The notebook names this dataset, but does not record its version, archive hash, original recording provenance or speaker/source groups. This repository does not establish permission to redistribute audio.
2. Cells 1–2 use a private `kaggle.json` credential and the Kaggle CLI to download and unzip data. Keep the credential private and out of notebook outputs and commits. The CLI must already be installed and authenticated; this notebook has no installation cell.
3. Check the environment provides `librosa`, `numpy`, `pandas`, `tqdm`, `scikit-learn`, `seaborn`, `matplotlib`, `soundfile` and `joblib`, plus Colab's `google.colab` module. These are observed imports, not a tested or pinned dependency specification. Record actual package versions for each run.
4. Confirm the extracted class folders are `/content/deep_voice_data/KAGGLE/AUDIO/REAL` and `/content/deep_voice_data/KAGGLE/AUDIO/FAKE`, or edit `REAL_PATH` and `FAKE_PATH` in cell 4.
5. Run cells 3–6 for the initial feature extraction, train/test split and evaluation. Cell 7 optionally reports class counts. Keep later data-modification and retraining cells separate from this baseline.

Cell 3 loads up to three seconds after a 0.5-second offset, using librosa's default sample rate. It averages 13 MFCCs, 13 first derivatives and 13 second derivatives into 39 features. Cell 4 takes up to 5,000 directory entries per class **before** filtering lowercase `.wav`/`.mp3` names. Directory order is not sorted, so a fixed split seed alone does not fix the chosen files or split membership. Loading errors are skipped; feature-computation errors can still stop execution.

Cell 5 uses an 80/20 file split with `random_state=42`, fits `StandardScaler` on training features only, and trains an RBF SVM with `C=1.0`, `gamma='scale'`. Cell 6 prints accuracy, per-class precision/recall/F1 and a confusion matrix. No fresh execution or independently verified accuracy is documented here.

## Evaluation and later cells

- The baseline split is not stratified and has no speaker/recording groups. Correlated clips or speakers could appear on both sides; actual overlap has not been measured. Audit source identities and duplicates before claiming performance on unseen speakers or recordings.
- Cells 8 and 13 write chunks into the source folders and delete originals. Use a disposable copy if experimenting. Cell 8 sets 30-second chunks but uses `_10s_chunk_` filenames and excludes `_30s_chunk_` names. Its naming and repeat-run behavior need correction before use.
- Cells 9–15 include full-data training and uploads that change the dataset. Those fitted models are different from the held-out baseline. A new upload is not automatically an independent test set.
- Cell 16 scans five-second windows with two-second overlap, whereas training extraction uses the three-second crop with a 0.5-second offset. The displayed probabilities and verdict thresholds have no documented calibration or independent validation. They do not establish forensic reliability.
- Cell 17 exports `Rdeepfake_svm_model.pkl` and `Rdeepfake_scaler.pkl`. Cell 19 expects filenames with ` (1)` appended; align its load paths with the actual uploaded names. Load only trusted model files.
- Cell 18 creates another 80/20 diagnostic model; it does not evaluate the full-data `clf` that cell 17 exports. A small train/test accuracy gap alone does not demonstrate generalization.

For a reproducible follow-up, preserve immutable raw audio, record file hashes and source identities, choose split groups before chunking, and save selected files/split membership, package versions, configuration, skipped-file counts and fresh output. Keep evaluation and final full-data training clearly distinguished.

## Licensing and current limits

No license file or contribution instructions were found in the repository at commit `89e347ea5e3286688fc63760f9218be5fde168db`. Confirm code and data rights before redistribution. This README documents the inspected code; it does not certify a working web build, data download, trained model, calibrated scores or end-to-end integration.
