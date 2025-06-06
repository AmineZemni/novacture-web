import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import chaiExclude from 'chai-exclude'
import dirtyChai from 'dirty-chai'
import * as sinon from 'sinon'
import { createSandbox } from 'sinon'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)
chai.use(chaiAsPromised)
chai.use(chaiExclude)
chai.use(dirtyChai)

const expect = chai.expect
export { createSandbox, expect, sinon }
