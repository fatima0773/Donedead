import React, { useState, useEffect } from 'react';
import { Row, Col, Pagination, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import ProductCards from './ProductCards';
import Heading from '../../../../components/heading/heading';
import { PaginationWrapper, NotFoundWrapper } from '../../Style';
import { getAllProducts } from '../../../../redux/product/actionCreator';

const Grid = () => {
  const dispatch = useDispatch();
  const { productsAll, isLoader } = useSelector(state => {
    return {
      productsAll: state.products.data,
      isLoader: state.products.loading,
    };
  });

  const [state, setState] = useState({
    products: productsAll,
    current: 0,
    pageSize: 10,
  });

  const { products } = state;

  useEffect(() => {
    dispatch(getAllProducts());
  }, []);

  useEffect(() => {
    if (productsAll) {
      setState({
        current: 0,
        pageSize: 10,
        products: productsAll,
      });
    }
  }, [productsAll]);

  const onShowSizeChange = (current, pageSize) => {
    setState({ ...state, current, pageSize });
  };

  const onHandleChange = (current, pageSize) => {
    // You can create pagination in here

    const s = current * pageSize - pageSize;

    products = products.slice(s, current * pageSize);

    setState({ products, current, pageSize });
  };

  return (
    <Row gutter={30}>
      {isLoader ? (
        <Col xs={24}>
          <div className="spin">
            <Spin />
          </div>
        </Col>
      ) : products?.length ? (
        products.map(({ _id, title, price, image, size, category, sku, slug }) => {
          return (
            <Col xxl={6} lg={12} xs={24} key={_id}>
              <ProductCards product={{ _id, title, price, image, size, category, sku, slug }} />
            </Col>
          );
        })
      ) : (
        <Col md={24}>
          <NotFoundWrapper>
            <Heading as="h1">Data Not Found</Heading>
          </NotFoundWrapper>
        </Col>
      )}
      <Col xs={24} className="pb-30">
        <PaginationWrapper style={{ marginTop: 10 }}>
          {products?.length ? (
            <Pagination
              onChange={onHandleChange}
              showSizeChanger
              onShowSizeChange={onShowSizeChange}
              pageSize={10}
              defaultCurrent={1}
              total={productsAll ? productsAll.length : 0}
            />
          ) : null}
        </PaginationWrapper>
      </Col>
    </Row>
  );
};

export default Grid;
