import {OpenAI} from "openai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const openai=new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/** Fetch Jira Issues using the Jira MCP
 * 
 */

async function fetchJiraIssues(jiraId) {
    console.log(`\n🔍 Connecting to JIRA mcp server and fetching jira issue [ ${jiraId}]`);

    // In a live environment, this replaces with: mcpClient.callTool("get_issue", { id: jiraId })
    // For validation autonomy, we use a production-grade realistic mock payload

    return{
        
         id: jiraId,
         summary: "Implement Multi-Factor Authentication (MFA) Login Flow",
         description: "As a registered user, I want to be prompted for a 6-digit MFA token after typing my valid password so that my account security is enhanced.\n\nAcceptance Criteria:\n1. Users must see an MFA verification screen after a successful password entry.\n2. The 6-digit input box must only accept numbers.\n3. Entering an incorrect or expired token 3 times sequentially must lock out the account for 15 minutes.\n4. Clicking 'Resend Code' must trigger a new notification toast and invalidate the prior token.",
         status: "To Do",
         project: "Ecomm Retail - WebStore",
    }
}

/**
 *  use Open AI to execute requirement analysis and generate a structure Markdown documen
 */

export async function executePhase2Analysis(jiraId,docDirectory) {
    try{

        const rawIssue=await fetchJiraIssues(jiraId);
        console.log(`\n Invoking OpenAI Analyzer agent for:"${rawIssue.summary}"`)

        const systemPrompt = `You are an elite Principal Business Analyst and Lead Automation Engineer. 
Analyze the provided JIRA issue details and create an exhaustive requirements analysis document. 
Your output must be written in clear Markdown format and MUST contain these explicit sections:
1. Requirement Analysis & Technical Overview
2. Explicit Clarifications & Inferred Workflows
3. Open Questions for Product Owner (PO) / Business Analyst (BA)
4. Granular Functionality Breakdowns (extracted from description)
5. Structured Acceptance Criteria Matrix

Be highly technical, identifying boundary limitations, negative validation assumptions, and UX edge cases.`;

    const userPrompt = `JIRA Ticket: ${rawIssue.id}
Title: ${rawIssue.summary}
Project Context: ${rawIssue.project}
Raw Description & Context:
\"\"\"
${rawIssue.description}
\"\"\"`;
    

    const reponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system",content: systemPrompt},
            { role: "user", content: userPrompt}
        ],
        temperature: 0.2,
    });

    const analystMarkDown = reponse.choices[0].message.content;
    const outputFilepath = path.join(docDirectory,'requirment_analysis.md');
    fs.writeFileSync(outputFilepath,analystMarkDown,'utf-8');
    console.log(`📝 Generated successfully: ${outputFilepath}`);
    console.log(`\n✅ Phase-2 Analysis completed. Requirement Analysis document generated at: ${outputFilepath}`);
    return true;
  }
    catch (error) {
    console.error(`❌ Phase 2 Processing Failure:`, error.message);
    throw error;
  }
  }

