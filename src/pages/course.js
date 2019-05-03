import React from 'react';
import { Divider, Icon, Col, Row, Pagination, message, Spin, Card } from 'antd';
import styles from './css/course.css';
import { getCourseList } from '@/services/CourseService';
import router from 'umi/router';

class Course extends React.Component {

    componentDidMount() {
        document.getElementById('root').scrollIntoView(true);//为ture返回顶部，false为底部
        this.reloadCourseList();
    }

    state = {
        spinning: false,
        pageNum: 1,
        pageSize: 8,
        total: 0,
        list: [],
    };

    reloadCourseList() {
        let courseQO = {
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
        };
        this.setState({
            spinning: true,
        });
        getCourseList(courseQO).then((result) => {
            let pageVO = result.data;
            this.setState({
                spinning: false,
                pageNum: pageVO.pageNum,
                pageSize: pageVO.pageSize,
                total: pageVO.total,
                list: pageVO.list,
            });
        });
    }

    //页码改变方法
    onChange = (pageNum) => {
        this.setState({
            pageNum: pageNum,
        }, () => {
            this.reloadCourseList();
        });
    };


    showMessage(result) {
        if (result.success === true) {
            message.success(result.msg, 1);
        } else {
            message.error(result.msg, 1);
        }
    }


    jump2CourseDetail(id) {
        console.log(id);
        router.push({
            pathname: '/courseDetails',
            query: {
                courseId: id,
            },
        });
    };

    render() {

        return (
            <React.Fragment>
                <div>
                    <b style={{ fontSize: 30, fontFamily: '楷体' }}><Icon type="book"/>&nbsp;&nbsp;皮影戏课程</b>
                    <Divider/>
                </div>
                <div>
                    <Spin spinning={this.state.spinning}>
                        <Row gutter={40}>
                            {this.state.list.map((course) => {
                                return (
                                    <Col span={6} key={course.id}>
                                        <div
                                            style={{ paddingTop: 10 }}
                                        >
                                            <Card
                                                bordered={false}
                                                className={styles.card}
                                                onClick={() => this.jump2CourseDetail(course.id)}
                                                hoverable
                                                bodyStyle={{height:240}}
                                            >
                                                <img className={styles.img} alt=""
                                                     src={course.mainImageUrl}/>
                                                <div style={{ paddingTop: 10 }}>
                                                    &nbsp;&nbsp;&nbsp;
                                                    <b style={{ fontSize: 20, fontFamily: '宋体' }}
                                                    >
                                                        {course.courseName}
                                                    </b>
                                                    <p style={{ color: '#888' }}>
                                                        &nbsp;&nbsp;&nbsp;已参加人数&nbsp;&nbsp;&nbsp;
                                                        <Icon type="user"/>
                                                        &nbsp;&nbsp;&nbsp;{course.paidNumber}
                                                    </p>
                                                </div>
                                            </Card>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Spin>
                    <div style={{ textAlign: 'center',paddingTop:20}}>
                        <Pagination
                            hideOnSinglePage={true}
                            pageSize={this.state.pageSize}
                            defaultCurrent={1}
                            total={this.state.total}
                            onChange={this.onChange}/>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


export default Course;
