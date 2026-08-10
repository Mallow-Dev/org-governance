export type ProtectionRules = any;

export interface GovernanceSettings {
  branches?: {
    main?: {
      protection?: ProtectionRules;
    };
  };
  repository_classes?: Record<
    string,
    {
      name_prefix?: string;
      branches?: {
        main?: {
          protection?: ProtectionRules;
        };
      };
    }
  >;
}

export function protectionRulesForRepository(
  repoName: string,
  settings: GovernanceSettings,
): ProtectionRules | undefined {
  const defaultProtection = settings.branches?.main?.protection;
  const matchingClasses = Object.values(settings.repository_classes ?? {})
    .filter(
      (classSettings) =>
        typeof classSettings.name_prefix === "string" &&
        repoName.startsWith(classSettings.name_prefix),
    )
    .sort(
      (left, right) =>
        right.name_prefix!.length - left.name_prefix!.length,
    );

  return matchingClasses[0]?.branches?.main?.protection ?? defaultProtection;
}
