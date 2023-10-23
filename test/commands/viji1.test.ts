
import {expect, test} from '@oclif/test'

describe('viji1', () => {
  test
  .stdout()
  .command(['viji1'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['viji1', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
  