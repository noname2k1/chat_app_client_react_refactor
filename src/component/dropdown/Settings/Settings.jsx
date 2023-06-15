import React from 'react';
import './Settings.scss';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';

const Settings = () => {
    const navItems = [];
    const { Header, Content, Footer, Sider } = Layout;
    const [collapsed, setCollapsed] = React.useState(true);
    return (
        <div className='settings-container'>
            <Layout
                style={{
                    maxWidth: 'fit-content',
                }}
            >
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    breakpoint='lg'
                    collapsedWidth='100px'
                    onBreakpoint={(broken) => {
                        console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                    }}
                    width='200px'
                >
                    <Menu
                        theme='dark'
                        mode='inline'
                        defaultSelectedKeys={['4']}
                        items={navItems.map((icon, index) => ({
                            key: String(index + 1),
                            icon: React.createElement(icon),
                            label: `nav ${index + 1}`,
                        }))}
                    />
                </Sider>
                <Layout
                    style={{
                        minWidth: '800px',
                        maxWidth: '800px',
                    }}
                >
                    <Header
                        className='site-layout-sub-header-background'
                        style={{
                            padding: 0,
                        }}
                    >
                        {React.createElement(
                            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                            {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            }
                        )}
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px 0',
                        }}
                    >
                        <div
                            className='site-layout-background'
                            style={{
                                padding: 24,
                                minHeight: 360,
                            }}
                        >
                            content
                        </div>
                    </Content>
                    <Footer
                        style={{
                            textAlign: 'center',
                        }}
                    ></Footer>
                </Layout>
            </Layout>
        </div>
    );
};

export default Settings;
