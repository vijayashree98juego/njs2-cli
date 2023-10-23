
import {expect, test} from '@oclif/test'

describe('endpoint', () => {
  test
  .stdout()
  .command(['endpoint'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['endpoint', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
  