import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Table } from 'antd';
import FeatherIcon from 'feather-icons-react';
import { TopToolBox } from './Style';
import { PageHeader } from '../../components/page-headers/page-headers';
import { Main, TableWrapper } from '../styled';
import { AutoComplete } from '../../components/autoComplete/autoComplete';
import { Button } from '../../components/buttons/buttons';
import { Cards } from '../../components/cards/frame/cards-frame';
import { ShareButtonPageHeader } from '../../components/buttons/share-button/share-button';
import { ExportButtonPageHeader } from '../../components/buttons/export-button/export-button';
import { CalendarButtonPageHeader } from '../../components/buttons/calendar-button/calendar-button';
import { sellerFilter } from '../../redux/sellers/actionCreator';
import { updateUser } from '../../api';

const Sellers = () => {
  const { searchData, sellers } = useSelector(state => {
    return {
      searchData: state.headerSearchData,
      sellers: state.sellers.data,
    };
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(sellerFilter());
  }, []);

  console.log(sellers);
  const [state, setState] = useState({
    notData: searchData,
    item: sellers,
    selectedRowKeys: [],
  });
  const { notData, selectedRowKeys, item } = state;
  useEffect(() => {
    if (sellers) {
      setState({
        item: sellers,
        selectedRowKeys,
      });
    }
  }, [sellers, selectedRowKeys]);
  const handleSearch = searchText => {
    const data = searchData.filter(value => value.title.toUpperCase().startsWith(searchText.toUpperCase()));
    setState({
      ...state,
      notData: data,
    });
  };
  const dataSource = [];
  if (sellers?.length)
    item?.map(value => {
      const { firstName, lastName, _id, email, balance, verified, date, img } = value;
      return dataSource.push({
        key: _id,
        name: (
          <div className="seller-info">
            <>
              <img src={img} alt="" />
              {firstName} {lastName}
            </>
          </div>
        ),
        email,
        // product: <span className="product-id">{product}</span>,
        balance: balance ? balance : 0,
        verified: verified ? 'VERIFIED' : 'NOT VERIFIED',
        action: (
          <div className="table-actions">
            <>
              {verified ? (
                ''
              ) : (
                <Button
                  style={{ backgroundColor: 'red', color: 'white', marginLeft: '5px' }}
                  onClick={() => updateUser({ ...value, verified: true })}
                >
                  Mark as Verified
                </Button>
              )}

              {/* <Button className="btn-icon" type="info" to="#" shape="circle">
                <FeatherIcon icon="edit" size={16} />
              </Button>
              <Button className="btn-icon" type="danger" to="#" shape="circle">
                <FeatherIcon icon="trash-2" size={16} />
              </Button> */}
            </>
          </div>
        ),
      });
    });
  const columns = [
    {
      title: 'Sellers',
      dataIndex: 'name',
      key: 'name',
    },
    // {
    //   title: 'Store',
    //   dataIndex: 'store',
    //   key: 'store',
    // },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Wallet Balance',
      dataIndex: 'balance',
      key: 'balance',
    },
    {
      title: 'Verified',
      dataIndex: 'verified',
      key: 'verified',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
  ];
  const onSelectChange = selectedRowKey => {
    setState({ ...state, selectedRowKeys: selectedRowKey });
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <>
      <PageHeader
        ghost
        title="Sellers"
        // buttons={[
        //   <div key="1" className="page-header-actions">
        //     <CalendarButtonPageHeader key="1" />
        //     <ExportButtonPageHeader key="2" />
        //     <ShareButtonPageHeader key="3" />
        //     <Button size="small" key="4" type="primary">
        //       <FeatherIcon icon="plus" size={14} />
        //       Add New
        //     </Button>
        //   </div>,
        // ]}
      />
      <Main>
        <Cards headless>
          <Row gutter={15}>
            <Col md={24}>
              {/* <TopToolBox>
                <Row gutter={15}>
                  <Col xxl={5} lg={10} xs={24}>
                    <div className="table-search-box">
                      <AutoComplete onSearch={handleSearch} dataSource={notData} width="100%" patterns />
                    </div>
                  </Col>
                  <Col xxl={15} lg={5} xs={24} />
                  <Col xxl={4} lg={9} xs={24}>
                    <div className="table-toolbox-actions">
                      <Button size="small" type="secondary" transparented>
                        Export
                      </Button>
                      <Button size="small" type="primary">
                        + Add Order
                      </Button>
                    </div>
                  </Col>
                </Row>
              </TopToolBox> */}
            </Col>
            <Col md={24}>
              <TableWrapper className="table-seller table-responsive">
                <Table
                  rowSelection={rowSelection}
                  dataSource={dataSource}
                  columns={columns}
                  pagination={{ pageSize: 7, showSizeChanger: true, total: sellers?.length }}
                />
              </TableWrapper>
            </Col>
          </Row>
        </Cards>
      </Main>
    </>
  );
};

export default Sellers;
