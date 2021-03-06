/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import page from 'page';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import HeaderCake from 'components/header-cake';
import TaxonomyManager from 'blocks/taxonomy-manager';
import { getSelectedSite, getSelectedSiteId } from 'state/ui/selectors';
import { getPostTypeTaxonomy } from 'state/post-types/taxonomies/selectors';
import DocumentHead from 'components/data/document-head';

const Taxonomies = ( { translate, labels, postType, site, taxonomy } ) => {
	const goBack = () => {
		page( '/settings/writing/' + site.slug );
	};

	return (
		<div className="main main-column" role="main">
			<DocumentHead title={ translate( 'Manage %(taxonomy)s', { args: { taxonomy: labels.name } } ) } />
			<HeaderCake onClick={ goBack }>
				<h1>{ labels.name }</h1>
			</HeaderCake>
			<TaxonomyManager taxonomy={ taxonomy } postType={ postType } />
		</div>
	);
};

export default localize( connect(
	( state, { taxonomy, postType } ) => {
		const siteId = getSelectedSiteId( state );
		const site = getSelectedSite( state );
		const labels = get( getPostTypeTaxonomy( state, siteId, postType, taxonomy ), 'labels', {} );
		return {
			site,
			labels
		};
	}
)( Taxonomies ) );
