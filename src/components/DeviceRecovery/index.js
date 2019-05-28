import { connect } from 'react-redux';

import DeviceRecovery from './DeviceRecovery';
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
)(DeviceRecovery);
