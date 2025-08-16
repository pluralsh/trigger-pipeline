import * as core from "@actions/core";
import * as path from "path";

const gqlDoc = `
mutation CreatePipelineContext($pipelineName: String!, $attributes: PipelineContextAttributes!) {
  createPipelineContext(pipelineName: $pipelineName, attributes: $attributes) {
    id
    pipeline { id }
  }
}
`

async function main() {
    const url = core.getInput('url');
    const token = core.getInput('token');
    const pipeline = core.getInput('pipeline');
    const context = core.getInput('context');

    try {
        JSON.parse(context);
    } catch (e) {
        core.setFailed(`context must be a valid JSON object, got: ${context}`);
        return;
    }

    const response = await fetch(path.join(url, 'gql'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
            query: gqlDoc, 
            variables: { pipeline, attributes: { context } } 
        }),
    });

    if (!response.ok) {
        const body = await response.text();
        core.setFailed(`Failed to create pull request: ${response.status}\n${body}`);
        return;
    }

    const resp = await response.json();
    const ctx = resp.data?.createPipelineContext;

    if (!ctx) {
        core.setFailed(`Failed to create pipeline context: ${JSON.stringify(resp.errors)}`);
        return;
    }
    core.info(`Created pipeline context: ${ctx.id}.  View the pipeline at ${path.join(url, "cd", 'pipelines', ctx.pipeline.id)}`);
}

main();