# trigger-pipeline Github Action

Github Action to invoke a Plural Pipeline.  Commonly used to trigger pipelines after docker image builds or other CI-native processes that need to be bridged to a GitOps workflow.  The action itself is a very thin js wrapper over the gql api call for your Plural Console instance.

## Inputs

```yaml
url:
  description: the url of your Plural Console instance
  required: true
token:
  description: the token to use to authenticate with Plural Console
  required: true
pipeline:
  description: the name of the pipeline to trigger
  required: true
context:
  description: the context to provide to the pipeline (JSON encoded)
  required: true
```

## Example Usage

```yaml
- name: Authenticate
  id: plural
  uses: pluralsh/setup-plural@v2
  with:
    consoleUrl: https://my.console.cloud.plural.sh
    email: someone@example.com # the email bound to your OIDC federated credential
- name: Trigger PR
  uses: pluralsh/trigger-pipeline@v1
  with:
    url: https://my.console.cloud.plural.sh
    token: ${{ steps.plural.outputs.consoleToken }}
    pipleline: flow-test
    context: |
      {
        "flow": "flow-test",
        "tag": "0.1.3"
      }
```

For this to be possible you need to have configured the following:

1. Federated credential to allow `someone@example.com` to exchange a GH actions token for a temporary Plural token.  This token should have at least the scope `createPipelineContext`.
2. A write binding on the `flow-test` Pipeline to allow `someone@exmaple.com` to invoke it.  This is not permissible by default.
3. The `flow-test` pipeline itself.  Feel free to look over some examples in https://docs.plural.sh or utilize our service catalog which often creates these for a variety of different usecases.

