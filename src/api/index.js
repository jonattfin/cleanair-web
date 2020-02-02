import mockApi from './mockApi'
import realApi from './realApi'

const useMock = true;
export default useMock ? mockApi : realApi;
