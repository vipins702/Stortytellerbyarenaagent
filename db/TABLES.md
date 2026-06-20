# Final SaaS Database Table List

Use `db/neon-complete-setup.sql` for a fresh Neon database.

## SaaS / tenancy

1. User
2. Tenant
3. TenantMember
4. TenantInvite
5. TenantSettings
6. Organization legacy compatibility table
7. Membership legacy compatibility table
8. OnboardingState
9. OnboardingStep

## AI / generation / token usage

10. AIProviderConfig
11. AIUsageEvent
12. GenerationJob
13. GenerationStep
14. GenerationAsset

## Website builder / publishing

15. Website
16. Page
17. Template
18. ComponentDefinition
19. Asset
20. PublishVersion
21. Domain

## Commerce

22. Product
23. ProductVariant
24. Order

## Leads / analytics / experiments

25. Lead
26. AnalyticsEvent
27. ABTest
28. ABVariant

## Billing / operations / reliability

29. Subscription
30. AuditLog
31. WebhookEvent

## Tenant/user ownership

Operational tables now include `tenantId` and `userId` columns for SaaS ownership and filtering.

Root identity tables are special:

- `User` has `primaryTenantId` because one user can belong to multiple tenants.
- `Tenant` has `ownerUserId` because it is the tenant root.

Important AI-related fields:

- `AIProviderConfig.encryptedApiKey`
- `AIProviderConfig.defaultTextModel`
- `AIProviderConfig.defaultImageModel`
- `AIProviderConfig.defaultCodeModel`
- `AIUsageEvent.promptTokens`
- `AIUsageEvent.completionTokens`
- `AIUsageEvent.totalTokens`
- `AIUsageEvent.estimatedCostCents`
- `GenerationJob.inputTokens`
- `GenerationJob.outputTokens`
- `GenerationJob.totalTokens`
- `GenerationJob.estimatedCostCents`
- `GenerationStep.inputTokens`
- `GenerationStep.outputTokens`
- `GenerationStep.totalTokens`
- `GenerationStep.estimatedCostCents`
