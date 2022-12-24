import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Radio, Table } from 'antd';
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
import { updateArrive, updateVerified } from '../../api';
import { ticketFilter } from '../../redux/tickets/actionCreator';

const Tickets = () => {
  const dispatch = useDispatch();
  const { searchData, tickets } = useSelector(state => {
    return {
      searchData: state.headerSearchData,
      tickets: state.tickets.data,
    };
  });

  const [state, setState] = useState(
    {
      notData: searchData,
      item: tickets,
      selectedRowKeys: [],
    },
    [tickets],
  );

  const { notData, item, selectedRowKeys } = state;
  const filterKey = ['Shipped', 'Awaiting Shipment', 'Canceled'];

  useEffect(() => {
    dispatch(ticketFilter());
  }, []);

  useEffect(() => {
    if (tickets) {
      console.log(tickets);
      setState({
        item: tickets,
        selectedRowKeys,
      });
    }
  }, [tickets, selectedRowKeys]);

  const handleSearch = searchText => {
    const data = searchData.filter(value => value.title.toUpperCase().startsWith(searchText.toUpperCase()));
    setState({
      ...state,
      notData: data,
    });
  };

  const handleChangeForFilter = e => {
    dispatch(orderFilter('status', e.target.value));
  };

  const dataSource = [];
  if (tickets) {
    tickets.map((value, key) => {
      const { status, _id, offerer, amount, image } = value;
      return dataSource.push({
        key: key + 1,
        id: <span className="order-id">{_id}</span>,
        customer: <span className="customer-name">{offerer}</span>,
        status: (
          <span
            className={`status ${
              status === 'Shipped' ? 'Success' : status === 'Awaiting Shipment' ? 'warning' : 'error'
            }`}
          >
            {status}
          </span>
        ),
        image: <Button>View Image</Button>,
        amount: <span className="ordered-amount">{amount}</span>,
        // date: <span className="ordered-date">{date}</span>,
        action: (
          <div className="table-actions">
            <>
              {status === 'ARRIVED' ? (
                ''
              ) : (
                <Button
                  style={{ backgroundColor: 'blue', color: 'white' }}
                  //   onClick={() => updateArrive({ _id, offer: { ...value, status: 'ARRIVED' } })}
                >
                  Mark as Rejected
                </Button>
              )}

              {status === 'VERIFIED' ? (
                ''
              ) : (
                <Button
                  style={{ backgroundColor: 'red', color: 'white', marginLeft: '5px' }}
                  //   onClick={() => updateVerified({ _id, offer: { ...value, status: 'VERIFIED' } })}
                >
                  Mark as Verified
                </Button>
              )}

              {/* <Button className="btn-icon" type="primary" to="#" shape="circle">
                <FeatherIcon icon="eye" size={16} />
              </Button>
              <Button className="btn-icon" type="info" to="#" shape="circle">
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
  }

  const columns = [
    {
      title: 'Ticket Id',
      dataIndex: 'id',
      key: 'id',
    },
    // {
    //   title: 'customer',
    //   dataIndex: 'customer',
    //   key: 'customer',
    // },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
    },
    // {
    //   title: 'Date',
    //   dataIndex: 'date',
    //   key: 'date',
    // },
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
    onChange: (selectedRowKeys, selectedRows) => {
      onSelectChange(selectedRowKeys);
    },
  };

  return (
    <>
      <PageHeader
        ghost
        title="Orders"
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
            <Col xs={24}>
              {/* <TopToolBox>
                <Row gutter={15} className="justify-content-center">
                  <Col lg={6} xs={24}>
                    <div className="table-search-box">
                      <AutoComplete onSearch={handleSearch} dataSource={notData} width="100%" patterns />
                    </div>
                  </Col>
                  <Col xxl={14} lg={16} xs={24}>
                    <div className="table-toolbox-menu">
                      <span className="toolbox-menu-title"> Status:</span>
                      <Radio.Group onChange={handleChangeForFilter} defaultValue="">
                        <Radio.Button value="">All</Radio.Button>
                        {item?.length &&
                          [...new Set(filterKey)].map(value => {
                            return (
                              <Radio.Button key={value} value={value}>
                                {value}
                              </Radio.Button>
                            );
                          })}
                      </Radio.Group>
                    </div>
                  </Col>
                  <Col xxl={4} xs={24}>
                    <div className="table-toolbox-actions">
                      <Button size="small" type="secondary" transparented>
                        Export
                      </Button>
                      <Button size="small" type="primary">
                        <FeatherIcon icon="plus" size={12} /> Add Order
                      </Button>
                    </div>
                  </Col>
                </Row>
              </TopToolBox> */}
            </Col>
          </Row>
          <Row gutter={15}>
            <Col md={24}>
              <TableWrapper className="table-order table-responsive">
                <Table
                  rowSelection={rowSelection}
                  dataSource={dataSource}
                  columns={columns}
                  pagination={{ pageSize: 7, showSizeChanger: true, total: tickets?.length }}
                />
              </TableWrapper>
            </Col>
          </Row>
        </Cards>
      </Main>
    </>
  );
};

export default Tickets;
