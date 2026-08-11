import React from 'react'
import { Flex, Separator } from '@radix-ui/themes'
import { PageIndicator } from './page_indicator'
import { ZoomTool } from './zoom_tool'

/**
 * SDK-owned page navigation and zoom controls for a host-provided bottom HUD.
 * The controls continue to read and mutate the active PdfViewerContext.
 */
export const PageZoomControl: React.FC = () => (
    <Flex align="center" gap="2" data-inklayer-page-zoom-control="true">
        <PageIndicator persistent />
        <Separator orientation="vertical" />
        <ZoomTool />
    </Flex>
)
