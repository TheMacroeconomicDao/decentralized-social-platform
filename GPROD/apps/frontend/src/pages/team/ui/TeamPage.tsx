import { Flex, Input, Button, Typography, DropdownIcon } from '@/shared/ui';
import { useTheme } from '@emotion/react'
import { createFileRoute } from '@tanstack/react-router';
import React from 'react'


export const TeamsPage: React.FC = () => {
    const theme = useTheme();
    return (
        <>
            <Flex
                p="25px 40px"
                gap="10px"
                justifyContent='space-between'
                w='100%'
            >
                <Flex
                    gap="10px"
                >
                    <Input placeholder="Search" />
                    <Button variant="primaryMain">
                        <Typography
                            color={theme.primary.dark}
                            variant={'menu_body1'}
                        >
                            Me
                        </Typography>
                    </Button>
                </Flex>
                <Flex
                    alignContent='flex-end'
                    alignItems='flex-end'
                    gap='10px'
                >
                    <Button variant="blueDark">
                        <Typography variant={'menu_body1'}>Clear</Typography>
                    </Button>
                    <Button variant="primaryMain">
                        <Typography
                            color={theme.primary.dark}
                            variant={'menu_body1'}
                        >
                            Apply
                        </Typography>
                    </Button>
                </Flex>
            </Flex>
            <Flex>

            </Flex>
        </>
    )
}
