import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const Preset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#fff7ed',  // Lightest shade
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',  // Lighter orange
            500: '#f27924',  // Your primary orange
            600: '#ea580c',  // Slightly darker
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',  // Darkest shade
            950: '#431407'
        }
    },
    components: {
        button: {
            colorScheme: {
                light: {
                    root: {
                        border: {
                            radius: '0.3rem'
                        },
                        lg: {
                            padding: {
                                x: '0.5rem', 
                                y: '1rem'
                            }
                        },
                        info: {
                            background: 'transparent',
                            border: {
                                color: 'transparent',
                            },
                            color: '#5289ff'
                        }
                    }
                }
            }
        },
        card: {
            colorScheme: {
                light: {
                    root: {
                        border: {
                            radius: '0.3rem'
                        },
                        shadow: 'none'
                    }
                }
            }
        },
        datatable: {
            colorScheme: {
                light: {
                    root: {
                        header: {
                            cell: {
                                background: '#fefef9',
                                border: {
                                    color: '#ebe8e8',
                                },
                                padding: '0.75rem 0.5rem'
                            }
                        },
                        body: {
                            cell: {
                                border: {
                                    color: '#ebe8e8',
                                },
                                padding: '0.2rem 0.5rem'
                            }
                        }
                    }
                }
            }
        },
        datepicker: {
            colorScheme: {
                light: {
                    root: {
                        dropdown: {
                            background: '#007ad9',
                            border: {
                                color: '#007ad9',
                                radius: '0.3rem'
                            },
                            color: '#fff',
                            hover: {
                                background: '#0372c9',
                                border: {
                                    color: '#0372c9'
                                },
                                color: '#fff'
                            }
                        }
                    }
                }
            }
        },
        fileupload: {
            colorScheme: {
                light: {
                    root: {
                        background: 'transparent',
                    }
                }
            }
        },
        inputtext: {
            colorScheme: {
                light: {
                    root: {
                        border: {
                            color: '#a6a6a6',
                            radius: '0.3rem'
                        },
                        padding: {
                            x: '0.5rem'
                        }
                    }
                }
            }
        },
        multiselect: {
            colorScheme: {
                light: {
                    root: {
                        border: {
                            color: '#a6a6a6',
                            radius: '0.3rem'
                        },
                        padding: {
                            x: '0.5rem',
                            y: '0.5rem'
                        }
                    }
                }
            }
        },
        paginator: {
            colorScheme: {
                light: {
                    root: {
                        background: '#f9f9f9',
                        border: {
                            radius: '0rem'
                        },
                        gap: '0rem',
                        nav: {
                            button: {
                                width: '1.3rem',
                                height: '1.3rem'
                            }
                        },
                        padding: '0.5rem',
                    }
                }
            }
        },
        panel: {
            colorScheme: {
                light: {
                    root: {
                        background: '#fff',
                        border: {
                            radius: '0.3rem',
                        },
                        content: {
                            padding: '0.5rem 1.125rem 0.3rem 1.125rem'
                        },
                        header: {
                            background: '#f9f9f9',
                            border: {
                                radius: '0.3rem'
                            },
                            font: {
                                weight: '600'
                            },
                            padding: '0.75rem 1.125rem'
                        },
                        toggleable: {
                            header: {
                                padding: '0.75rem 1.125rem'
                            }
                        }
                    }
                }
            }
        },
        select: {
            colorScheme: {
                light: {
                    root: {
                        border: {
                            color: '#a6a6a6',
                            radius: '0.3rem'
                        },
                        padding: {
                            x: '0.5rem',
                            y: '0.5rem'
                        }
                    }
                }
            }
        }
    }
});

export default Preset;

// skeleton
// colorScheme: {
//     light: {
//         root: {
//         }
//     }
// }

// button: {
//     primary: {
//         background: '{primary.500}',
//             text: 'white',
//                 border: '{primary.500}',
//                     radius: '0.3rem',
//                         hover: {
//             background: '{primary.600}',
//                 text: 'white',
//                     border: '{primary.600}'
//         }
//     }
// },
