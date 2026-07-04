import { Command } from 'commander';
import fs from 'fs';
import path from 'path';

const program = new Command();

program
  .name('autonomous-qa-agent-pipeline')
  .description('Execute the autonomous QA agent pipeline')
  .version('1.0.0')
  .requiredOption('-j, --jira <issue-id>', 'Target JIRA Issue ID (e.g., QA-101, PROJ-456)')
  .parse(process.argv);

const options = program.opts();
const jiraId = options.jira.toUpperCase();

// Basic regex to validate JIRA issue ID format (e.g., PROJ-123)
const jiraIdPattern = /^[A-Z0-9]+-[0-9]+$/;

if (!jiraIdPattern.test(jiraId)) {
  console.error(`❌ Error: Invalid JIRA Issue ID format: ${jiraId}. Expected format is PROJECT-123.`);
  process.exit(1);
}

console.log(`\n🚀 Initializing Autonomous Execution Workflow for Issue ID: ${jiraId}`);

// Define dynamic local workspace path based on the JIRA ID
const workspacePath = path.join(process.cwd(), 'runs', jiraId);
const documentationPath = path.join(workspacePath, 'documentation');
const codeOutputDir = path.join(workspacePath, 'generated_tests');

try {
  fs.mkdirSync(documentationPath, { recursive: true });
  fs.mkdirSync(codeOutputDir, { recursive: true });

  console.log(`📁 Workspace Root created: ${workspacePath}`);
  console.log(`   └─ Documentation Sync: ${documentationPath}`);
  console.log(`   └─ Script Generation : ${codeOutputDir}`);

  console.log(`\n✅ Phase 1 Framework Entry Point Validation successfully completed.`);
} catch (error) {
  console.error('❌ Critical System Failure initializing local workspace:', error.message);
  process.exit(1);
}

