/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Main from 'components/main';
import { getSelectedSiteId } from 'state/ui/selectors';
import { successNotice, errorNotice } from 'state/notices/actions';

import { editProduct, editProductAttribute } from 'woocommerce/state/ui/products/actions';
import { getCurrentlyEditingProduct } from 'woocommerce/state/ui/products/selectors';
import { getProductVariationsWithLocalEdits } from 'woocommerce/state/ui/products/variations/selectors';
import { editProductVariation } from 'woocommerce/state/ui/products/variations/actions';
import { fetchProductCategories } from 'woocommerce/state/sites/product-categories/actions';
import { getProductCategories } from 'woocommerce/state/sites/product-categories/selectors';
import { createProduct } from 'woocommerce/state/sites/products/actions';
import ProductForm from './product-form';
import ProductHeader from './product-header';
import SidebarNavigation from 'my-sites/sidebar-navigation';

class ProductCreate extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		siteId: PropTypes.number,
		product: PropTypes.shape( {
			id: PropTypes.isRequired,
		} ),
		fetchProductCategories: PropTypes.func.isRequired,
		editProduct: PropTypes.func.isRequired,
		editProductAttribute: PropTypes.func.isRequired,
	};

	componentDidMount() {
		const { product, siteId } = this.props;

		if ( siteId ) {
			if ( ! product ) {
				this.props.editProduct( siteId, null, {
					type: 'simple'
				} );
			}
			this.props.fetchProductCategories( siteId );
		}
	}

	componentWillReceiveProps( newProps ) {
		if ( newProps.siteId !== this.props.siteId ) {
			this.props.editProduct( newProps.siteId, null, {
				type: 'simple'
			} );
			this.props.fetchProductCategories( newProps.siteId );
		}
	}

	componentWillUnmount() {
		// TODO: Remove the product we added here from the edit state.
	}

	onTrash = () => {
		// TODO: Add action dispatch to trash this product.
	}

	onSave = () => {
		const { siteId, product, translate } = this.props;

		const successAction = successNotice(
			translate( '%(product)s successfully created.', {
				args: { product: product.name },
			} ),
			{ duration: 4000 }
		);

		const errorAction = errorNotice(
			translate( 'There was a problem saving %(product)s. Please try again.', {
				args: { product: product.name },
			} )
		);

		this.props.createProduct( siteId, product, successAction, errorAction );
	}

	render() {
		const { siteId, product, className, variations, productCategories } = this.props;

		return (
			<Main className={ className }>
				<SidebarNavigation />
				<ProductHeader
					onTrash={ this.onTrash }
					onSave={ siteId && this.onSave || false }
				/>
				{ siteId && ( <ProductForm
					siteId={ siteId }
					product={ product || { type: 'simple' } }
					variations={ variations }
					productCategories={ productCategories }
					editProduct={ this.props.editProduct }
					editProductAttribute={ this.props.editProductAttribute }
					editProductVariation={ this.props.editProductVariation }
				/> ) }
			</Main>
		);
	}
}

function mapStateToProps( state ) {
	const siteId = getSelectedSiteId( state );
	const product = getCurrentlyEditingProduct( state, siteId );
	const variations = product && getProductVariationsWithLocalEdits( state, product.id, siteId );
	const productCategories = getProductCategories( state, siteId );

	return {
		siteId,
		product,
		variations,
		productCategories,
	};
}

function mapDispatchToProps( dispatch ) {
	return bindActionCreators(
		{
			createProduct,
			editProduct,
			editProductAttribute,
			editProductVariation,
			fetchProductCategories,
		},
		dispatch
	);
}

export default connect( mapStateToProps, mapDispatchToProps )( localize( ProductCreate ) );
