import React, { Component } from 'react'
// import Cookies from 'js-cookie'
import PropTypes from 'prop-types'
import {Table, Button, Form, Input, DatePicker, Modal, Select, Popconfirm, message, Divider} from 'antd'
import AddOrder from './AddOrder'
import moment from 'moment'
import ajax from '../../api'
import './record.scss'
const Option = Select.Option
const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

export class RecordForm extends Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    visible: false,
    startTime: '',
    endTime: '',
    orderCode: '',
    status: 0,
    modalTitle: '发布订单',
    modalObj: {
      id: '',
      total: 1,
      merchantPrice: '',
      eassyType: '',
      notes: '',
      orderTitle: '',
      originalLevel: '',
      picture: 2,
      type: 0,
      endTime: '2018-09-02',
      require: '',
      wordCount: 2000
    },
    isEdit: false,
    statusArr: [
      // 0：待审核 1：发布中 2：已完成 3：待点评 4：商家已打款5：取消 6：关闭 7：管理员已完成（已打款）, 8 - 审核未通过
      {
        name: '待审核',
        value: 0
      },
      {
        name: '发布中',
        value: 1
      },
      {
        name: '已完成',
        value: 2
      },
      {
        name: '待点评',
        value: 3
      },
      {
        name: '商家已打款',
        value: 4
      },
      {
        name: '取消',
        value: 5
      },
      {
        name: '关闭',
        value: 6
      },
      {
        name: '管理员已完成(已打款)',
        value: 7
      },
      {
        name: '审核未通过',
        value: 8
      }
    ],
    data: [
      {
        id: '1',
        key: '1',
        orderStatus: 1,
        orderCode: '',
        eassyType: '',
        orderTitle: '',
        notes: '',
        originalLevel: '',
        picture: 2,
        type: 0,
        require: '',
        wordCount: 222,
        total: 2,
        appointTotal: 1,
        merchantPrice: 33,
        createdAt: '2018',
        endTime: '',
        result: ''
      }],
    columns: [
      {
        title: '订单号',
        dataIndex: 'orderCode',
        render: text => <a href='javascript:;'>{text}</a>
      }, {
        title: '订单标题',
        dataIndex: 'orderTitle'
      }, {
        title: '文章数量',
        dataIndex: 'total'
      }, {
        title: '已预约数量',
        dataIndex: 'appointTotal',
        render: text => <span>{text || 'null'}</span>
      }, {
        title: '商户定价',
        dataIndex: 'merchantPrice'
      }, {
        title: '发布状态',
        dataIndex: 'orderStatus',
        render: (text, record) => {
          // 0：待审核 1：发布中 2：已完成 3：待点评 4：商家已打款5：取消 6：关闭 7：管理员已完成（已打款）, 8 - 审核未通过
          return (
            <div>
              {
                text === 0 ? <span>待审核</span> : (text === 1) ? <span>发布中</span> : (text === 2) ? <span>已完成</span> : (text === 3) ? <span>待点评</span> : (text === 4) ? <span>商家已打款</span> : (text === 5) ? <span>取消</span> : (text === 6) ? <span>关闭</span> : (text === 7) ? <span>管理员已完成(已打款)</span> : (text === 8) ? <span>审核未通过</span> : ''
                // <a href='javascript:;' onClick={() => this.handleDetail(record)}>查看详情<Divider type='vertical' /></a>
              }
            </div>
          )
        }
      }, {
        title: '发布时间',
        dataIndex: 'createdAt',
        render: text => <span>{moment.unix(parseInt(text.toString().slice(0, 10))).format('YYYY-MM-DD HH:mm:ss')}</span>
      }, {
        title: '截稿时间',
        dataIndex: 'endTime',
        render: text => <span>{moment.unix(parseInt(text.toString().slice(0, 10))).format('YYYY-MM-DD HH:mm:ss')}</span>
      }, {
        title: '审核结果',
        dataIndex: 'result',
        render: text => (text || 'null')
      }, {
        title: '操作',
        dataIndex: 'operate',
        render: (text, record) => {
          return (
            <div>
              {
                <a href='javascript:;' onClick={() => this.handleDetail(record)}>查看详情<Divider type='vertical' /></a>
              }
              {
                <a onClick={() => this.edit(record)}>编辑<Divider type='vertical' /></a>
              }
              {
                <Popconfirm title='确定删除吗?' onConfirm={() => this.handleDelete(record)}>
                  <a href='javascript:;' className='delete'>删除</a>
                </Popconfirm>
              }

            </div>
          )
        }
      }
    ]
  };
  publicOrder = () => {
    this.setState({
      visible: true,
      isEdit: false,
      modalTitle: '发布订单',
      modalObj: {
        id: '',
        total: 1,
        merchantPrice: '',
        eassyType: '',
        notes: '',
        orderTitle: '',
        originalLevel: '',
        picture: 2,
        type: 0,
        endTime: '',
        require: '',
        wordCount: 2000
      }
    })
  }
  handleSubmit=(e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.getOrder()
      }
    })
  }
  getOrder = () => {
    let params = {
      orderCode: this.state.orderCode,
      status: this.state.status,
      startTime: this.state.startTime,
      endTime: this.state.endTime
    }
    ajax.getOrder(params, response => {
      if (response.state.stateCode === 0) {
        response.data.content.map((item, index) => {
          item.key = index + ''
        })

        this.setState({
          data: response.data.content
        })
      } else {
        message.error(response.state.stateMessage || '请稍后再试')
      }
    }, error => {
      console.log(error)
    })
  }
  onChange = (date, dateString) => {
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1]
    })
  }
  handleDetail=(row) => {
    console.log(row, 'row')
    // window.open(axiosUrl + '/detailOrder?flag=1')
    window.open(window.location.origin + `/#/detailOrder?id=${row.id}`)
    // this.props.history.push(`/detailOrder?id=${row.id}`)
  }
  handleDelete = (record) => {
    console.log(record)
    // const dataSource = [...this.state.data]
    ajax.deleteOrder({ id: record.id }, response => {
      if (response.state.stateCode === 0) {
        message.success(response.state.stateMessage || '删除成功')
        // this.setState({ data: dataSource.filter(item => item.key !== record.key) })
        this.getOrder()
      } else {
        message.error('删除失败，请重试')
        this.getOrder()
      }
    }, error => {
      console.log(error)
      message.error('删除失败，请重试')
      this.getOrder()
    })
  }

  edit (record) {
    this.setState({
      isEdit: true,
      visible: true,
      modalTitle: '修改订单',
      modalObj: {
        orderStatus: record.orderStatus,
        id: record.id,
        total: record.total,
        merchantPrice: record.merchantPrice,
        eassyType: record.eassyType,
        notes: record.notes,
        orderTitle: record.orderTitle,
        originalLevel: record.originalLevel,
        picture: record.picture,
        type: record.type,
        endTime: record.endTime,
        require: record.require,
        wordCount: record.wordCount
      }
    })
  }

  save (form, key) {
    console.log(form, key)
    form.validateFields((error, row) => {
      console.log(row)
      if (error) {
        return
      }
      ajax.updateUser(row, response => {
        if (response.state.stateCode === 0) {
          message.success(response.msg)
        } else {
          message.error('修改失败，请重试')
        }
      }, error => {
        console.log(error)
        message.error('修改失败，请重试')
      })
    })
  }

  onCancel=() => {
    this.setState({
      visible: false
    })
  }
  InpChange=(e) => {
    this.setState({
      orderCode: e.target.value
    })
  }
  selectChange = (value) => {
    this.setState({
      status: value
    })
  }
  componentDidMount () {
    this.getOrder()
  }
  render () {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
    return (
      <div className='record'>
        <div className='title'>
          <Button type='primary' onClick={this.publicOrder}>发布订单</Button>
          <Form layout='inline' onSubmit={this.handleSubmit} className='record-form'>
            <FormItem
              {...formItemLayout}
              label='订单号'
            >
              {getFieldDecorator('orderCode', { initialValue: '' })(
                <Input placeholder='请输入订单号' onChange={this.InpChange} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='订单状态'
            >
              {getFieldDecorator('status', {
                initialValue: this.state.status
              })(
                <Select placeholder='请选择订单状态' style={{ width: 120 }} onChange={this.selectChange}>
                  {
                    this.state.statusArr.map((item, index) => {
                      return <Option key={index} value={item.value}>{item.name}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='起止时间'
            >
              {(
                <RangePicker onChange={this.onChange} />
              )}
            </FormItem>
            <FormItem>
              <Button type='primary' htmlType='submit'>查询</Button>
            </FormItem>
          </Form>
        </div>
        <Table columns={this.state.columns} dataSource={this.state.data} />
        <Modal
          title={this.state.modalTitle}
          visible={this.state.visible}
          footer={null}
          onCancel={this.onCancel}
        >
          <AddOrder modalObj={this.state.modalObj} onCancel={this.onCancel} isEdit={this.state.isEdit} getOrder={this.getOrder} modalTitle={this.state.modalTitle} />
        </Modal>
      </div>
    )
  }
}
const Record = Form.create()(RecordForm)

RecordForm.propTypes = {
  form: PropTypes.object
}
export default Record
