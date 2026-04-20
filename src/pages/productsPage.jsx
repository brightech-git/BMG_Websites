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
  const { itemCtrName } = queryString.parse(location.search);

  console.log(itemCtrName, 'datas for breadcrumb');

  // Update document meta
  useDocumentMeta({
    title: 'BMG - Shop Left',
    description: '#',
  });

  return (
    <Fragment>

      {/* Pass query params to Breadcrumb */}
      <Breadcrumbs itemCtrName={itemCtrName} pages="products-page" />
      {/* <SmoothScroll> */}
        <Content itemCtrName={itemCtrName} />
      {/* </SmoothScroll> */}
   
     
    </Fragment>
  );
};

export default ProductsPage;
