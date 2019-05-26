import React, { Component } from 'react';
import {
    Breadcrumb as AntBreadcrumb,
    Table, Divider, Dropdown,
    Form, Input, Select, InputNumber, Switch, Radio,
    Slider, Button, Upload, Icon, Rate, Checkbox,
    Row, Col,
    Card
} from 'antd';
import ReactHtmlParser from 'react-html-parser';
import RouterUrls from '../constants/RouterUrls';
import moment from 'moment';


function highlightText(text, search, cb) {
    let result = text;

    if(search && search.trim()){
        function toReg(search) {
            search = search.replace('a', '(a|á|à|ả|ã|ạ|ă|â)');
            search = search.replace('ă', '(ă|ắ|ằ|ẳ|ẵ|ặ)');
            search = search.replace('â', '(â|ấ|ầ|ẩ|ẫ|ậ)');
            search = search.replace('e', '(e|é|è|ẻ|ẽ|ẹ|ê)');
            search = search.replace('ê', '(ê|ế|ề|ể|ễ|ệ)');
            search = search.replace('u', '(u|ú|ù|ủ|ũ|ụ|ư)');
            search = search.replace('ư', '(ư|ứ|ừ|ử|ữ|ự)');
            search = search.replace('i', '(i|í|ì|ỉ|ĩ|ị)');
            search = search.replace('o', '(o|ó|ò|ỏ|õ|ọ|ơ|ô)');
            search = search.replace('ơ', '(ơ|ớ|ờ|ở|ỡ|ợ)');
            search = search.replace('ô', '(ô|ố|ồ|ổ|ỗ|ộ)');
            const searchRegex = new RegExp(search, 'gi');
            return searchRegex;
        }

        const reg = toReg(search);
        result = text.replace(reg, cb);
        result = ReactHtmlParser(result);
    }

    return result;
}


const Breadcrumb = ({ path }) => {
    function getBreadCrumb(path, prefix = 'Home') {
        let tmp = [];

        let currentPath = path;
        while (currentPath !== '') {
            currentPath = RouterUrls.find(item => item.path === currentPath);
            if (currentPath) {
                tmp.unshift(currentPath.label);
                currentPath = currentPath.path.split('/').slice(0, -1).join('/');
            }
            else {
                break;
            }
        }
        tmp.unshift(prefix);

        return tmp;
    }

    const bc = getBreadCrumb(path);

    return (
        <div className='breadcrumb-area'>
            <AntBreadcrumb>
                {
                    bc && bc.map((item, index) =>
                        <AntBreadcrumb.Item key={index}>
                            {item}
                        </AntBreadcrumb.Item>
                    )
                }
            </AntBreadcrumb>
        </div>
    );
};


const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
    },
};


class AdminPage extends Component {
    constructor() {
        super();

        this.state = {
            list: [],
            count: 1,
            limit: 1,
            page: 1,
            searchText: '',
            sort: 'oldest'
        }
    }

    componentWillMount() {
        this.fetchItem('http://nodejs-book-api.herokuapp.com/api/product')
            .then(json => {
                this.setState({
                    list: json.list,
                    count: json.count,
                    limit: json.limit,
                    page: json.page
                });
            });
    }

    fetchItem = (url, params={}) => {
        let q = [];
        for(let param in params){
            if(params[param]){
                q.push(param+'='+params[param]);   
            }
        }
        q = q.length?q = '?'+q.join('&'):'';
        return fetch(url + q)
        .then(res => res.json());
    }

    /******************** PAGINATION ********************/
    goToPage = (page) => {
        const filterParams = {
            page,
            limit: this.state.limit,
            search: this.state.searchText,
            sort: this.state.sort
        };

        this.fetchItem('http://nodejs-book-api.herokuapp.com/api/product', filterParams)
            .then(json => {
                this.setState({
                    list: json.list,
                    count: json.count,
                    limit: json.limit,
                    page: json.page
                });
            });
    }

    handleTableChange = (pagination, filter, sorter) => {
        console.log('TABLE CHANGE', filter, sorter);
    }

    /******************** SEARCH ********************/
    handleSearch = (text) => {
        this.fetchItem('http://nodejs-book-api.herokuapp.com/api/product', { search: text })
            .then(json => {
                this.setState(
                    {
                        list: json.list,
                        count: json.count,
                        limit: json.limit,
                        page: json.page,
                        searchText: text
                    }
                );
            });
    }

    handleSearchCategory = (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log(12345, e.target.value);
    }

    handleSort = (sort) => {
        const filterParams = {
            page: 1,
            limit: this.state.limit,
            search: this.state.searchText,
            sort
        };

        this.fetchItem('http://nodejs-book-api.herokuapp.com/api/product', filterParams)
            .then(json => {
                this.setState(
                    {
                        list: json.list,
                        count: json.count,
                        limit: json.limit,
                        page: json.page,
                        sort
                    }
                );
            });
    }

    render() {
        const { match } = this.props;
        const { list, count, limit, page } = this.state;
        const pagination = {
            total: count,
            pageSize: limit,
            current: page,
            onChange: (page) => {
                this.goToPage(page);
            }
        };


        const searchDropdown = (
            <div className='ant-table-filter-dropdown' style={{ padding: 8 }}>
                <Input
                    placeholder={`Search Name`}
                    value={this.state.searchText}
                    onChange={e => this.setState({ searchText: e.target.value })}
                    onClick={e => e.stopPropagation()}
                    onPressEnter={e => this.handleSearch(e.target.value)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(this.state.searchText)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button
                    onClick={() => this.handleSearch('')}
                    size="small"
                    style={{ width: 90 }}
                >
                    Reset
                </Button>
            </div>
        );
        const searchCategoryDropdown = (
            <div className='ant-table-filter-dropdown'>
                <div style={{ padding: 8 }} onClick={e => e.stopPropagation()}>
                    <Radio.Group onChange={this.handleSearchCategory}>
                        <Radio value={'a'} style={{ display: 'block' }}>A</Radio>
                        <Radio value={'b'} style={{ display: 'block' }}>B</Radio>
                    </Radio.Group>
                </div>
                <div className='ant-table-filter-dropdown-btns'>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(this.state.searchText)}
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        OK
                    </Button>
                    <Button
                        onClick={() => this.handleSearch('')}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </div>
            </div>
        );
        /******************** TABLE ********************/
        const columns = [
            {
                title: 'Image',
                dataIndex: 'img',
                key: 'img',
                render: (text) => <img src={text} className='table-image' />
            },
            {
                title: (
                    <div>
                        <span>Name</span>
                        <Dropdown overlay={searchDropdown} trigger={['click']} placement="bottomRight">
                            <Icon
                                className='ant-table-filter-icon'
                                type="search"
                                style={{ color: '#1890ff' }}
                            />
                        </Dropdown>
                    </div>
                ),
                dataIndex: 'name',
                key: 'name',
                render: text => highlightText(text, this.state.searchText, match => `<span style='background: yellow'>${match}</span>`)
                // render: text => (
                //     <Highlighter
                //         highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                //         searchWords={[this.state.searchText]}
                //         autoEscape
                //         textToHighlight={text.toString()}
                //     />
                // )
            },
            {
                title: (
                    <div>
                        <span>Price</span>
                        <div>
                            <Icon
                                className='ant-table-filter-icon'
                                type="caret-up"
                                style={{ color: '#1890ff', display: 'block', top: -5 }}
                                title={'Ascending'}
                                onClick={() => this.handleSort('price-asc')}
                            />
                            <Icon
                                className='ant-table-filter-icon'
                                type="caret-down"
                                style={{ color: '#1890ff', display: 'block', top: 5 }}
                                title={'Descending'}
                                onClick={() => this.handleSort('price-desc')}
                            />
                        </div>
                    </div>
                ),
                dataIndex: 'price',
                key: 'price',
                width: '100px',
                render: (text) => `$${text}`
            },
            {
                title: (
                    <div>
                        <span>Category</span>
                        <Dropdown overlay={searchCategoryDropdown} trigger={['click']} placement="bottomRight">
                            <Icon
                                className='ant-table-filter-icon'
                                type="filter"
                                style={{ color: '#1890ff' }}
                            />
                        </Dropdown>
                    </div>
                ),
                dataIndex: 'category.name',
                key: 'category',
                width: '200px',
            },
            {
                title: 'Updated At',
                dataIndex: 'updatedAt',
                key: 'updatedAt',
                width: '120px',
                render: (text) => moment(text).format('DD/MM/YYYY')
            },
            {
                title: 'Action',
                dataIndex: 'action',
                width: '150px',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a href='javascript:;' title='Edit'>Edit</a>
                        <Divider type='vertical' />
                        <a href='javascript:;' title='Delete'>Delete</a>
                    </span>
                )
            }
        ];

        return (
            <div className='admin-page'>
                <aside className='admin-sidebar-area'>
                    <ul className='admin-sidebar-list'>
                        <li className='admin-sidebar-list-item'>
                            <span>Theme</span>
                            <ul className='admin-sidebar-sublist'>
                                <li className='admin-sidebar-list-item'>
                                    <span><i className='fa fa-tint admin-sidebar-list-item-icon'></i>Color</span>
                                    <span><i className='fa fa-font admin-sidebar-list-item-icon'></i>Typography</span>
                                </li>
                            </ul>
                        </li>
                        <li className='admin-sidebar-list-item'>
                            <span>Components</span>
                            <ul className='admin-sidebar-sublist'>
                                <li className='admin-sidebar-list-item'>
                                    <span><i className='fa fa-table admin-sidebar-list-item-icon'></i>Table</span>
                                </li>
                                <li className='admin-sidebar-list-item'>
                                    <span><i className='fa fa-object-ungroup admin-sidebar-list-item-icon'></i>Form</span>
                                </li>
                                <li className='admin-sidebar-list-item'>
                                    <span><i className='fa fa-list admin-sidebar-list-item-icon'></i>List</span>
                                </li>
                                <li className='admin-sidebar-list-item'>
                                    <span><i className='fa fa-paper-plane admin-sidebar-list-item-icon'></i>Card</span>
                                </li>
                                <li className='admin-sidebar-list-item'>
                                    <span><i className='fa fa-code admin-sidebar-list-item-icon'></i>Editor</span>
                                </li>
                                <li className='admin-sidebar-list-item'>
                                    <span><i className='fa fa-puzzle-piece admin-sidebar-list-item-icon'></i>Chart</span>
                                </li>
                                <li className='admin-sidebar-list-item'>
                                    <span><i className='fa fa-bell admin-sidebar-list-item-icon'></i>Notification</span>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </aside>
                <main className='admin-main-area'>
                    <div className='h-container'>
                        {
                            match && match.path && <Breadcrumb path={match.path} />
                        }

                        <h1 className='color-primary hide-to-md hide-from-lg'>hello there</h1>

                        <div className='table-area'>
                            <Table
                                columns={columns}
                                rowSelection={rowSelection}
                                dataSource={list}
                                rowKey={'_id'}
                                bordered
                                title={() => 'Header'}
                                footer={() => 'Footer'}
                                onChange={this.handleTableChange}
                                pagination={pagination}
                            />
                        </div>

                        <SampleForm />
                    </div>
                </main>
            </div>
        )
    }
}


class DemoForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        return (
            <div className='admin-form-area'>
                <Card loading={0}>
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item
                            label="Plain Text"
                        >
                            <span className="ant-form-text">China</span>
                        </Form.Item>
                        <Form.Item
                            label="Select"
                            hasFeedback
                        >
                            {getFieldDecorator('select', {
                                rules: [
                                    { required: true, message: 'Please select your country!' },
                                ],
                            })(
                                <Select placeholder="Please select a country">
                                    <Select.Option value="china">China</Select.Option>
                                    <Select.Option value="usa">U.S.A</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item
                            label="InputNumber"
                        >
                            {getFieldDecorator('input-number', { initialValue: 3 })(
                                <InputNumber min={1} max={10} />
                            )}
                            <span className="ant-form-text">machines</span>
                        </Form.Item>
                        <Form.Item
                            label="Upload"
                        >
                            {getFieldDecorator('upload', {
                                valuePropName: 'fileList',
                                getValueFromEvent: this.normFile,
                            })(
                                <Upload name="logo" action="/upload.do" listType="picture">
                                    <Button>
                                        <Icon type="upload" /> Click to upload
                                    </Button>
                                </Upload>
                            )}
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{ span: 12, offset: 6 }}
                        >
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        );
    }
}
const SampleForm = Form.create({ name: 'validate_other' })(DemoForm);


export default AdminPage;