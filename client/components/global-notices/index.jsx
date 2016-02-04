/**
 * External Dependencies
 */
import React from 'react';
import debugModule from 'debug';

/**
 * Internal Dependencies
 */
import Notice from 'components/notice';
import NoticeAction from 'components/notice/notice-action';
import notices from 'notices';
import observe from 'lib/mixins/data-observe';
import DeleteSiteNotices from 'notices/delete-site-notices';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { removeNotice } from 'state/notices/actions'

const debug = debugModule( 'calypso:notices' );

const NoticesList = React.createClass( {

	displayName: 'NoticesList',

	mixins: [ observe( 'notices' ) ],

	propTypes: {
		id: React.PropTypes.string,
		notices: React.PropTypes.oneOfType( [
			React.PropTypes.object,
			React.PropTypes.array
		] )
	},

	getDefaultProps() {
		return {
			id: 'overlay-notices',
			notices: Object.freeze( [] )
		};
	},

	componentWillMount() {
		debug( 'Mounting Global Notices React component.' );
	},

	removeNotice( notice ) {
		if ( notice ) {
			notices.removeNotice( notice );
		}
	},

	render() {
		const noticesRaw = this.props.notices[ this.props.id ] || [];
		let noticesList = noticesRaw.map( function( notice, index ) {
				return (
					<Notice
						key={ 'notice-old-' + index }
						status={ notice.status }
						text={ notice.text }
						isCompact={ notice.isCompact }
						onDismissClick={ this.removeNotice.bind( this, notice ) }
						showDismiss={ notice.showDismiss }
					>
						{ notice.button &&
							<NoticeAction
								href={ notice.href }
								onClick={ notice.onClick }
							>
								{ notice.button }
							</NoticeAction> }
						</Notice>
				);
			}, this );

		//This is an interim solution for displaying both notices from redux store
		//and from the old component. When all notices are moved to redux store, this component
		//needs to be updated.
		noticesList = noticesList.concat( this.props.storeNotices.map( function( notice, index ) {
			return (
				<Notice
					key={ 'notice-' + index }
					status={ notice.status }
					duration = { notice.duration || null }
					showDismiss={ notice.showDismiss }
					onDismissClick={ this.props.removeNotice.bind( this, notice.noticeId ) }
					text={ notice.text }>
				</Notice>
			);
		}, this ) );

		if ( ! noticesList.length ) {
			return null;
		}
		return (
			<div id={ this.props.id } className="global-notices">
				<DeleteSiteNotices />
				{ noticesList }
			</div>
		);
	}
} );

export default connect(
	state => {
		return {
			storeNotices: state.notices.items
		};
	},
	dispatch => bindActionCreators( { removeNotice }, dispatch )
)( NoticesList );
