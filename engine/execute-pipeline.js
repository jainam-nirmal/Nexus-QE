import { Command } from 'commander';
import fs from 'fs';
import path from 'path';

const program = new Command();
program
  .name('autonomous-qa-agent-pipeline')
  .requiredOption('-j, --jira <issue-id>', 'Target JIRA Issue ID (e.g., QA-101, PROJ-456)')
  .parse(process.argv);

// Define dynamic local workspace path based on the JIRA ID
const jiraId = program.opts().jira.toUpperCase();
const workspacePath = path.join(process.cwd(), 'runs', jiraId);
const documentationPath = path.join(workspacePath, 'documentation');
const codeOutputDir = path.join(workspacePath, 'generated_tests');

//set up workSpace directories
fs.mkdirSync(documentationPath, { recursive: true });
fs.mkdirSync(codeOutputDir, { recursive: true });

async function executePipeline() {
  console.log(`\n🚀 Starting Multi-Agent Pipeline for ${jiraId}`);

  // Phase 1: Context complete
  console.log(`\n🔹 Phase 1: Work space initialized sucessfully`);

  // Phase 2: Requirement Analysis
  console.log(`\n--- [PHASE 2: Starting Requirement Analysis Agent] ---`);
  await executePhase2Analysis(jiraId, documentationPath);

  console.log(`\n🎯 Pipeline Step Completed Successfully.`);
}

runPipeline().catch(err => {
  console.error('\n💥 Pipeline Execution Aborted:', err.message);
  process.exit(1);
});










