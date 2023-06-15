import React from 'react';
import styled from 'styled-components';
import { useThemeSelector } from '~/component/redux/selector';
const triangleStyle = `
content: '';
position: absolute;
width: 0;
height: 0;
display: none;
`;
const Wrapper = styled.span`
    position: relative;
    &:hover {
        span {
            display: block;
            &::before {
                display: block;
            }
        }
    }
`;
const Span = styled.span`
    display: none;
    position: absolute;
    white-space: nowrap;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    ${({ position }) => {
        switch (position) {
            case 'top':
                return 'bottom: 100%; left: 50%; transform: translateX(-50%);';
            case 'right':
                return 'top: 50%; left: 100%; transform: translateY(-50%);';
            case 'bottom':
                return 'top: 112%; left: 50%; transform: translateX(-50%);';
            case 'left':
                return 'top: 50%; right: 100%; transform: translateY(-50%);';
            default:
                return 'top: 112%; left: 50%; transform: translateX(-50%);';
        }
    }}
    ${({ position, theme }) => {
        switch (position) {
            case 'top':
                return `&&::before {
                    ${triangleStyle}
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    border-left: 7.5px solid transparent;
                    border-right: 7.5px solid transparent;
                    border-top: 7.5px solid ${
                        theme === 'dark' ? '#fff' : '#000'
                    };
                } `;
            case 'bottom':
                return `&&::before {
                   ${triangleStyle}
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    border-left: 7.5px solid transparent;
                    border-right: 7.5px solid transparent;
                    border-bottom: 7.5px solid ${
                        theme === 'dark' ? '#fff' : '#000'
                    };
                } `;
            case 'right':
                return `&&::before {
                    ${triangleStyle}
                    right: 100%;
                    top: 50%;
                    transform: translateY(-50%);
                    border-top: 7.5px solid transparent;
                    border-bottom: 7.5px solid transparent;
                    border-right: 7.5px solid ${
                        theme === 'dark' ? '#fff' : '#000'
                    };
                } `;
            case 'left':
                return `&&::before {
                    ${triangleStyle}
                    left: 100%;
                    top: 50%;
                    transform: translateY(-50%);
                    border-top: 7.5px solid transparent;
                    border-bottom: 7.5px solid transparent;
                    border-left: 7.5px solid ${
                        theme === 'dark' ? '#fff' : '#000'
                    };
                } `;
            default:
                return `&&::before {
                     ${triangleStyle}
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    border-left: 7.5px solid transparent;
                    border-right: 7.5px solid transparent;
                    border-bottom: 7.5px solid ${
                        theme === 'dark' ? '#fff' : '#000'
                    };
                } `;
        }
    }}
    font-weight: 500;
    font-size: 12px;
    padding: 5px 7px;
    border-radius: 5px;
    background-color: ${(props) => (props.theme === 'dark' ? '#fff' : '#000')};
    color: ${(props) => (props.theme === 'dark' ? '#000' : '#fff')};
    z-index: 2;
`;
const Tooltip = ({ children, title, position, disabled }) => {
    const { theme } = useThemeSelector();
    if (disabled) return children;
    return (
        <Wrapper className='tootip-wrapper'>
            {children}
            <Span position={position} theme={theme}>
                {title}
            </Span>
        </Wrapper>
    );
};

export default Tooltip;
