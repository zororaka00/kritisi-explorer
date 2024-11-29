import { defineCronHandler } from '#nuxt/cron';
import { PrismaClient } from '@prisma/client';

import { PROMPT_AUDIT } from '~/CONSTANT';
import { AuditResult } from '~/types';

var isLoop = false;
export default defineCronHandler('everyMinute', async () => {
    if (!isLoop) {
        isLoop = true;
        const prisma = new PrismaClient();
        const contracts = await prisma.contract.findMany({
            where: {
                isScanned: true,
                score: null,
                isProxy: false
            }
        });
        if (contracts.length > 0) {
            var isLoopInterval = false;
            var indexInterval = 0;
            const config = useRuntimeConfig();
            const geminiApiKey = config.geminiApiKey as string;
            var goInterval = setInterval(async () => {
                if (!isLoopInterval) {
                    isLoopInterval = true;
                    if (indexInterval >= contracts.length) {
                        clearInterval(goInterval);
                        isLoop = false;
                    } else {
                        const contract = contracts[indexInterval] as any;
                        const codeSolidity = typeof contract.dataObject == 'string' ? (JSON.parse(contract.dataObject))[0].SourceCode : contract.dataObject[0].SourceCode;
                        $fetch(
                            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
                            {
                                method: 'POST',
                                body: {
                                    contents: [
                                        {
                                            role: "model",
                                            parts: [
                                                {
                                                    text: PROMPT_AUDIT
                                                }
                                            ]
                                        },
                                        {
                                            role: "user",
                                            parts: [
                                                {
                                                    text: codeSolidity
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        ).then(async (response: any) => {
                            const result: AuditResult = JSON.parse(response.candidates[0].content.parts[0].text);
                            await prisma.contract.update({
                                where: { id: contract.id },
                                data: {
                                    securityObject: result as any,
                                    score: result.score
                                }
                            });
                            isLoopInterval = false;
                            indexInterval++;
                        }).catch(() => {
                            isLoopInterval = false;
                            indexInterval++;
                        });
                    }
                }
            }, 1000);
        } else {
            isLoop = false;
        }
    }
});