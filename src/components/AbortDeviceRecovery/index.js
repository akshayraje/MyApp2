import { connect } from 'react-redux';

import AbortDeviceRecovery from './AbortDeviceRecovery';
import { setLoading } from '../../actions';

const mapStateToProps = ({ isLoading }) => ({ isLoading });
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchLoadingState: (isLoading) => dispatch(setLoading(isLoading))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AbortDeviceRecovery);
