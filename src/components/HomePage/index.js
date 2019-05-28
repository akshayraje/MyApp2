import { connect } from 'react-redux';

import HomePage from './HomePage';
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
)(HomePage);
