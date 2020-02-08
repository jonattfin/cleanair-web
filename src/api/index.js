import mockApi from './mockApi'
import realApi from './realApi'

const useMock = false;
export default useMock ? mockApi : realApi;
