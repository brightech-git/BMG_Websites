// Shopleft.jsx
import React, { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Breadcrumb from '../layouts/Breadcrumbs';
import Content from '../sections/shopleft/Content';
import SmoothScroll from '../layouts/SmoothScroll';
import { useDocumentMeta } from '../../utils/meta/useMeta';

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
      <Breadcrumb itemCtrName={itemCtrName} pages="products-page" />

      <SmoothScroll>
        <Content />
      </SmoothScroll>

   
    </Fragment>
  );
};

export default ProductsPage;
