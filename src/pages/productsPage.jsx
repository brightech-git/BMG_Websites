// Shopleft.jsx
import React, { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Breadcrumbs from '../components/layouts/Breadcrumbs';
import Content from '../components/sections/productsPage/Content'
import { useDocumentMeta } from '../utils/meta/useMeta';
// import SmoothScroll from '../components/layouts/SmoothScroll';

const ProductsPage = () => {
  const location = useLocation();
  const { itemId ,subItemId,filterIds ,itemName } = queryString.parse(location.search);



  // Update document meta
  useDocumentMeta({
    title: 'BMG - Shop Left',
    description: '#',
  });

  return (
    <Fragment>

      {/* Pass query params to Breadcrumb */}
      <Breadcrumbs itemId={itemId} pages="products-page" subItemId={subItemId} filterId={filterIds}/>
      {/* <SmoothScroll> */}
      <Content ItemName={itemName} />
      {/* </SmoothScroll> */}


    </Fragment>
  );
};

export default ProductsPage;
