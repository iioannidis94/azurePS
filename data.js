// data.js - Add new commands and categories here

const data = [
  {
    id: "auth", label: "Auth & Subscriptions", icon: "🔐",
    cmds: [
      { name: "Connect-AzAccount", desc: "Connect to Azure — Interactive login or with Service Principal", code: "# Interactive login\nConnect-AzAccount\n\n# With specific tenant\nConnect-AzAccount -TenantId \"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"\n\n# Service Principal with client secret\n$secpw = ConvertTo-SecureString \"<client-secret>\" -AsPlainText -Force\n$cred  = New-Object System.Management.Automation.PSCredential(\"<appId>\", $secpw)\nConnect-AzAccount -ServicePrincipal -Credential $cred -TenantId \"<tenant-id>\"",
        params: [["-TenantId","Specific AAD tenant"],["-ServicePrincipal","Use SP for CI/CD"]] },
      { name: "Set-AzContext", desc: "Change active subscription without reconnecting", code: "Set-AzContext -SubscriptionId \"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"\n\n# Or by name\nSet-AzContext -SubscriptionName \"MySubscription\"",
        params: [["-SubscriptionId","Subscription GUID"],["-SubscriptionName","Alternatively by name"]] },
      { name: "Get-AzSubscription", desc: "List all available subscriptions in the account", code: "Get-AzSubscription | Format-Table Name, Id, State",
        params: [["-TenantId","Filters by tenant"]] },
      { name: "Clear-AzContext", desc: "Full logout — clears all cached credentials", code: "Clear-AzContext -Scope CurrentUser -Force",
        params: [["-Scope","CurrentUser (permanent) or Process (session)"]] }
    ]
  },
  {
    id: "rg", label: "Resource Groups", icon: "📁",
    cmds: [
      { name: "New-AzResourceGroup", desc: "Create new Resource Group with tags", code: "New-AzResourceGroup -Name \"myRG\" -Location \"westeurope\" `\n  -Tag @{Environment=\"Prod\"; CostCenter=\"IT-001\"}",
        params: [["-Name","RG Name"],["-Location","Azure Region"]] },
      { name: "Get-AzResourceGroup", desc: "List or search Resource Groups", code: "Get-AzResourceGroup | Where-Object {$_.ResourceGroupName -like \"*prod*\"}",
        params: [["-Name","Filters by exact name"]] },
      { name: "Remove-AzResourceGroup", desc: "Delete Resource Group and ALL its resources", code: "Remove-AzResourceGroup -Name \"myRG\" -Force -AsJob",
        params: [["-Force","Without prompt"],["-AsJob","Runs in background"]] },
      { name: "Move-AzResource", desc: "Move resource to another Resource Group", code: "$res = Get-AzResource -ResourceName \"myVM\" -ResourceGroupName \"sourceRG\"\nMove-AzResource -ResourceId $res.ResourceId -DestinationResourceGroupName \"destRG\"",
        params: [["-ResourceId","Resource ID"],["-DestinationResourceGroupName","Target RG"]] }
    ]
  },
  {
    id: "vm", label: "Compute / VMs", icon: "💻",
    cmds: [
      { name: "New-AzVM", desc: "Quick VM creation — auto-creates VNet/NIC/PublicIP", code: "New-AzVM `\n  -ResourceGroupName \"myRG\" -Name \"myVM\" `\n  -Location \"westeurope\" -Image \"Ubuntu2204\" `\n  -Size \"Standard_B2s\" -Credential (Get-Credential)",
        params: [["-Image","Ubuntu2204, Win2022Datacenter, etc."],["-Size","Standard_B1s, D2s_v3, etc."]] },
      { name: "Start-AzVM / Stop-AzVM", desc: "Start or Stop (deallocate) a VM", code: "Start-AzVM -ResourceGroupName \"myRG\" -Name \"myVM\"\n\n# Stop + deallocate (stops compute billing)\nStop-AzVM -ResourceGroupName \"myRG\" -Name \"myVM\" -Force",
        params: [["-Force","Without confirmation"]] },
      { name: "Get-AzVM", desc: "Get detailed VM info and PowerState", code: "Get-AzVM -ResourceGroupName \"myRG\" -Status | Select-Object Name, PowerState",
        params: [["-Status","Displays running/deallocated"]] },
      { name: "Update-AzVM", desc: "Change VM Size (SKU) - requires stop", code: "$vm = Get-AzVM -ResourceGroupName \"myRG\" -Name \"myVM\"\n$vm.HardwareProfile.VmSize = \"Standard_D4s_v3\"\nUpdate-AzVM -ResourceGroupName \"myRG\" -VM $vm",
        params: [["-VM","Modified VM object"]] }
    ]
  },
  {
    id: "net", label: "Networking", icon: "🌐",
    cmds: [
      { name: "New-AzVirtualNetwork", desc: "Create VNet and Subnet", code: "$subnet = New-AzVirtualNetworkSubnetConfig -Name \"Subnet1\" -AddressPrefix \"10.0.1.0/24\"\nNew-AzVirtualNetwork -ResourceGroupName \"myRG\" -Name \"myVNet\" `\n  -Location \"westeurope\" -AddressPrefix \"10.0.0.0/16\" -Subnet $subnet",
        params: [["-AddressPrefix","CIDR block"],["-Subnet","Subnet config object"]] },
      { name: "New-AzNetworkSecurityRuleConfig", desc: "Create NSG Firewall rule", code: "$rule = New-AzNetworkSecurityRuleConfig -Name \"Allow-RDP\" `\n  -Protocol Tcp -Direction Inbound -Priority 100 `\n  -SourceAddressPrefix * -SourcePortRange * `\n  -DestinationAddressPrefix * -DestinationPortRange 3389 -Access Allow\n\nNew-AzNetworkSecurityGroup -ResourceGroupName \"myRG\" -Name \"myNSG\" -Location \"weu\" -SecurityRules $rule",
        params: [["-Priority","100-4096 (lower = higher priority)"]] },
      { name: "Get-AzNetworkInterface", desc: "Get NIC details and attached IPs", code: "Get-AzNetworkInterface -ResourceGroupName \"myRG\" | Select-Object Name, MacAddress",
        params: [["-ResourceGroupName","Filters by RG"]] }
    ]
  },
  {
    id: "dns", label: "DNS & Traffic", icon: "🗺️",
    cmds: [
      { name: "New-AzDnsZone", desc: "Create a public or private DNS zone", code: "New-AzDnsZone -ResourceGroupName \"myRG\" -Name \"contoso.com\"", 
        params: [["-Name","Domain name"]] },
      { name: "New-AzDnsRecordSet", desc: "Add a DNS record (A, CNAME, TXT)", code: "$rs = New-AzDnsRecordSet -ResourceGroupName \"myRG\" -ZoneName \"contoso.com\" -Name \"www\" -RecordType \"A\" -Ttl 3600\nAdd-AzDnsRecordConfig -RecordSet $rs -Ipv4Address \"10.0.0.1\"\nSet-AzDnsRecordSet -RecordSet $rs", 
        params: [["-RecordType","A, AAAA, CNAME, MX, NS, SRV, TXT"]] }
    ]
  },
  {
    id: "storage", label: "Storage Services", icon: "🗄️",
    cmds: [
      { name: "New-AzStorageAccount", desc: "Create Storage Account", code: "New-AzStorageAccount -ResourceGroupName \"myRG\" -Name \"mystorageapp123\" `\n  -Location \"westeurope\" -SkuName \"Standard_LRS\" -Kind \"StorageV2\"",
        params: [["-SkuName","Standard_LRS, Premium_LRS, etc."],["-Kind","StorageV2 (recommended)"]] },
      { name: "Get-AzStorageAccountKey", desc: "Retrieve Access Keys", code: "$key = (Get-AzStorageAccountKey -ResourceGroupName \"myRG\" -Name \"mysa\")[0].Value\n$ctx = New-AzStorageContext -StorageAccountName \"mysa\" -StorageAccountKey $key",
        params: [["-Name","Storage Account name"]] },
      { name: "New-AzStorageShare", desc: "Create an Azure File Share", code: "$ctx = (Get-AzStorageAccount -ResourceGroupName \"myRG\" -Name \"mysa\").Context\nNew-AzStorageShare -Name \"myshare\" -Context $ctx -QuotaGiB 50",
        params: [["-Name","Share name"],["-QuotaGiB","Size limit in GB"]] },
      { name: "Set-AzStorageBlobContent", desc: "Upload file to Blob Storage", code: "Set-AzStorageBlobContent -File \"C:\\local.txt\" `\n  -Container \"mycontainer\" -Blob \"remote.txt\" -Context $ctx -Force",
        params: [["-File","Local file path"],["-Blob","Name in cloud"]] }
    ]
  },
  {
    id: "webapp", label: "App Services / Web", icon: "🌍",
    cmds: [
      { name: "New-AzAppServicePlan", desc: "Create App Service Plan", code: "New-AzAppServicePlan -ResourceGroupName \"myRG\" -Name \"myPlan\" `\n  -Location \"westeurope\" -Tier \"Standard\" -WorkerSize \"Small\"",
        params: [["-Tier","Free, Shared, Basic, Standard, Premium"]] },
      { name: "New-AzWebApp", desc: "Create Web App", code: "New-AzWebApp -ResourceGroupName \"myRG\" -Name \"myUniqueApp123\" -Location \"westeurope\" -AppServicePlan \"myPlan\"",
        params: [["-AppServicePlan","The App Service Plan"]] },
      { name: "Set-AzWebApp", desc: "Update App Settings (Environment Variables)", code: "$appSettings = @{ \"API_KEY\" = \"secret_value\"; \"ENV\" = \"prod\" }\nSet-AzWebApp -ResourceGroupName \"myRG\" -Name \"myUniqueApp123\" -AppSettings $appSettings",
        params: [["-AppSettings","Hashtable Key=Value"]] }
    ]
  },
  {
    id: "sql", label: "Databases / SQL", icon: "🗃️",
    cmds: [
      { name: "New-AzSqlServer", desc: "Create logical Azure SQL Server", code: "New-AzSqlServer -ResourceGroupName \"myRG\" -ServerName \"mysqlserver123\" `\n  -Location \"westeurope\" -SqlAdministratorCredentials (Get-Credential)",
        params: [["-ServerName","Unique global name"]] },
      { name: "New-AzSqlDatabase", desc: "Create SQL Database", code: "New-AzSqlDatabase -ResourceGroupName \"myRG\" -ServerName \"mysqlserver123\" `\n  -DatabaseName \"myDB\" -Edition \"Standard\" -RequestedServiceObjectiveName \"S2\"",
        params: [["-Edition","Basic, Standard, Premium"]] },
      { name: "Invoke-AzSqlDatabaseFailover", desc: "Force failover to secondary region", code: "Invoke-AzSqlDatabaseFailover -ResourceGroupName \"myRG\" -ServerName \"mysqlserver123\" -DatabaseName \"myDB\"",
        params: [["-DatabaseName","Database to failover"]] }
    ]
  },
  {
    id: "avd", label: "Virtual Desktop (AVD)", icon: "🖥️",
    cmds: [
      { name: "New-AzWvdHostPool", desc: "Create a new AVD Host Pool", code: "New-AzWvdHostPool -ResourceGroupName \"myRG\" -Name \"myHostPool\" `\n  -Location \"westeurope\" -HostPoolType \"Pooled\" -LoadBalancerType \"BreadthFirst\"", 
        params: [["-HostPoolType","Pooled or Personal"],["-LoadBalancerType","BreadthFirst or DepthFirst"]] },
      { name: "New-AzWvdApplicationGroup", desc: "Create a Desktop or RemoteApp group", code: "New-AzWvdApplicationGroup -ResourceGroupName \"myRG\" -Name \"myAppGroup\" `\n  -Location \"westeurope\" -ApplicationGroupType \"Desktop\" -HostPoolArmPath $hostpool.Id", 
        params: [["-ApplicationGroupType","Desktop or RemoteApp"]] },
      { name: "Get-AzWvdSessionHost", desc: "Check status of AVD Session Hosts", code: "Get-AzWvdSessionHost -ResourceGroupName \"myRG\" -HostPoolName \"myHostPool\" | Select-Object Name, Status, Sessions", 
        params: [["-HostPoolName","The parent host pool"]] }
    ]
  },
  {
    id: "cdn", label: "CDN & Front Door", icon: "⚡",
    cmds: [
      { name: "New-AzFrontDoor", desc: "Create an Azure Front Door instance", code: "New-AzFrontDoor -ResourceGroupName \"myRG\" -Name \"myFrontDoor\" `\n  -RoutingRule $routingRule -BackendPool $backendPool -FrontendEndpoint $frontendEndpoint", 
        params: [["-Name","Unique Front Door name"]] },
      { name: "Clear-AzFrontDoorCdnEndpointContent", desc: "Purge CDN cache for specific paths", code: "Clear-AzFrontDoorCdnEndpointContent -ResourceGroupName \"myRG\" `\n  -ProfileName \"myAFDProfile\" -EndpointName \"myEndpoint\" -ContentPath \"/images/*\"", 
        params: [["-ContentPath","Paths to purge (e.g., /* or /assets/*)"]] }
    ]
  },
  {
    id: "apim", label: "API Management", icon: "🔌",
    cmds: [
      { name: "New-AzApiManagement", desc: "Create a new APIM instance", code: "New-AzApiManagement -ResourceGroupName \"myRG\" -Name \"myAPIM\" `\n  -Location \"westeurope\" -Organization \"Contoso\" -AdminEmail \"admin@contoso.com\" -Sku \"Developer\"", 
        params: [["-Sku","Developer, Basic, Standard, Premium"]] },
      { name: "Get-AzApiManagementSubscription", desc: "List API Subscription keys", code: "Get-AzApiManagementSubscription -Context $apimContext", 
        params: [["-Context","The APIM context object"]] }
    ]
  },
  {
    id: "keyvault", label: "Key Vault", icon: "🔑",
    cmds: [
      { name: "New-AzKeyVault", desc: "Create Key Vault", code: "New-AzKeyVault -VaultName \"myKV-prod-001\" -ResourceGroupName \"myRG\" `\n  -Location \"westeurope\" -EnabledForDeployment -EnableSoftDelete",
        params: [["-EnabledForDeployment","Allows VMs to read secrets"]] },
      { name: "Set-AzKeyVaultSecret", desc: "Save Secret", code: "$secretval = ConvertTo-SecureString \"SuperSecretValue123!\" -AsPlainText -Force\nSet-AzKeyVaultSecret -VaultName \"myKV-prod-001\" -Name \"SQLPassword\" -SecretValue $secretval",
        params: [["-Name","Secret name"]] },
      { name: "Set-AzKeyVaultAccessPolicy", desc: "Grant permissions to user/SP", code: "Set-AzKeyVaultAccessPolicy -VaultName \"myKV-prod-001\" `\n  -UserPrincipalName \"user@contoso.com\" -PermissionsToSecrets Get,List,Set,Delete",
        params: [["-PermissionsToSecrets","Get,List,Set,Delete"]] }
    ]
  },
  {
    id: "cost", label: "Cost & Governance", icon: "💰",
    cmds: [
      { name: "Get-AzConsumptionUsageDetail", desc: "Get billing data", code: "Get-AzConsumptionUsageDetail -StartDate (Get-Date).AddDays(-7) -EndDate (Get-Date) -Top 20 | Format-Table InstanceName, PretaxCost",
        params: [["-Top","Number of records"]] },
      { name: "New-AzResourceLock", desc: "Lock resource (prevents deletion)", code: "New-AzResourceLock -LockName \"RG-Lock\" -LockLevel CanNotDelete -ResourceGroupName \"myRG\"",
        params: [["-LockLevel","CanNotDelete or ReadOnly"]] },
      { name: "New-AzPolicyAssignment", desc: "Assign an Azure Policy", code: "$policy = Get-AzPolicyDefinition | Where-Object { $_.Properties.DisplayName -eq 'Require a tag on resources' }\nNew-AzPolicyAssignment -Name \"RequireTagPolicy\" -PolicyDefinition $policy -Scope \"/subscriptions/<sub-id>\"", 
        params: [["-Scope","Subscription or RG scope"]] }
    ]
  },
  {
    id: "azcopy", label: "AzCopy / Data Transfer", icon: "🚀",
    cmds: [
      { name: "azcopy copy", desc: "Cloud-to-Cloud transfer", code: "azcopy copy \"https://<source-sa>.blob.core.windows.net/?<SAS>\" \"https://<target-sa>.blob.core.windows.net/?<SAS>\" --recursive",
        params:[["--recursive","Copies subdirectories/blobs"]] },
      { name: "azcopy sync", desc: "Sync — copies only changed/new files", code: "azcopy sync \"C:\\local\\folder\" \"https://mysa.blob.core.windows.net/mycontainer?<SAS>\" --delete-destination=true",
        params:[["--delete-destination","Deletes files that were removed locally"]] }
    ]
  },
  {
    id: "containers", label: "Containers (AKS/ACR)", icon: "☸️",
    cmds: [
      { name: "New-AzAksCluster", desc: "Create Kubernetes (AKS) Cluster", code: "New-AzAksCluster -ResourceGroupName \"myRG\" -Name \"myAKS\" -NodeCount 3 -NodeVmSize \"Standard_D2s_v3\"",
        params: [["-NodeCount","Initial number of nodes"]] },
      { name: "Import-AzAksCredential", desc: "Retrieve kubeconfig", code: "Import-AzAksCredential -ResourceGroupName \"myRG\" -Name \"myAKS\" -Force\nkubectl get nodes",
        params: [["-Force","Overwrite existing kubeconfig"]] },
      { name: "New-AzContainerRegistry", desc: "Create ACR", code: "New-AzContainerRegistry -ResourceGroupName \"myRG\" -Name \"myRegistry123\" -Sku Standard -Location \"weu\"",
        params: [["-Sku","Basic, Standard, Premium"]] }
    ]
  },
  {
    id: "security", label: "Security & Entra ID", icon: "🧑‍💼",
    cmds: [
      { name: "New-AzADUser", desc: "Create new user in Entra ID", code: "New-AzADUser -DisplayName \"John Doe\" -UserPrincipalName \"john@contoso.com\" `\n  -Password (ConvertTo-SecureString \"P@ssw0rd123!\" -AsPlainText -Force) -MailNickname \"john\" -AccountEnabled $true",
        params: [["-UserPrincipalName","User Email/UPN"]] },
      { name: "New-AzADServicePrincipal", desc: "Create Service Principal for CI-CD", code: "$sp = New-AzADServicePrincipal -DisplayName \"myDeploymentApp\"",
        params: [["-DisplayName","SP name"]] },
      { name: "New-AzRoleAssignment", desc: "Assign RBAC role", code: "New-AzRoleAssignment -SignInName \"user@contoso.com\" -RoleDefinitionName \"Contributor\" -ResourceGroupName \"myRG\"",
        params: [["-RoleDefinitionName","Owner, Contributor, Reader, etc."]] }
    ]
  }
];
