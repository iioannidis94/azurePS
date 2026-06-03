// data.js - Full Azure PowerShell & AzCopy Command Reference

const data = [
  {
    id: "auth", label: "Auth & Subscriptions", icon: "🔐",
    cmds: [
      { name: "Connect-AzAccount", desc: "Connect to Azure — Interactive login or with Service Principal for automation", code: "# Interactive login\nConnect-AzAccount\n\n# With specific tenant\nConnect-AzAccount -TenantId \"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"\n\n# Service Principal with credential\n$cred = Get-Credential\nConnect-AzAccount -ServicePrincipal -Credential $cred -TenantId \"<tenant-id>\"\n\n# Service Principal with client secret (non-interactive)\n$secpw = ConvertTo-SecureString \"<client-secret>\" -AsPlainText -Force\n$cred  = New-Object System.Management.Automation.PSCredential(\"<appId>\", $secpw)\nConnect-AzAccount -ServicePrincipal -Credential $cred -TenantId \"<tenant-id>\"",
        params: [["-TenantId","Specific AAD tenant"],["-ServicePrincipal","Use SP for CI/CD"],["-Subscription","Initial active subscription"],["-Environment","AzureCloud, AzureUSGovernment, etc."]] },
      { name: "Set-AzContext", desc: "Change active subscription without reconnecting", code: "Set-AzContext -SubscriptionId \"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"\n\n# Or by name\nSet-AzContext -SubscriptionName \"MySubscription\"",
        params: [["-SubscriptionId","Subscription GUID"],["-SubscriptionName","Alternatively by name"],["-TenantId","Change tenant too"]] },
      { name: "Get-AzSubscription", desc: "List all available subscriptions in the account", code: "Get-AzSubscription | Format-Table Name, Id, State\n\n# Only active\nGet-AzSubscription | Where-Object {$_.State -eq \"Enabled\"}\n\n# Filter by Tenant\nGet-AzSubscription -TenantId \"<tenant-id>\"",
        params: [["-TenantId","Filters by tenant"]] },
      { name: "Clear-AzContext", desc: "Full logout — clears all cached credentials", code: "Clear-AzContext -Scope CurrentUser -Force\n\n# Logout session only\nDisconnect-AzAccount",
        params: [["-Scope","CurrentUser (permanent) or Process (session)"],["-Force","Without confirmation prompt"]] }
    ]
  },
  {
    id: "rg", label: "Resource Groups", icon: "📁",
    cmds: [
      { name: "New-AzResourceGroup", desc: "Create new Resource Group with tags", code: "New-AzResourceGroup -Name \"myRG\" -Location \"westeurope\" `\n  -Tag @{Environment=\"Prod\"; Owner=\"Team1\"; CostCenter=\"IT-001\"}",
        params: [["-Name","RG Name"],["-Location","Azure Region (e.g., westeurope)"],["-Tag","Hashtable with tags"]] },
      { name: "Get-AzResourceGroup", desc: "List or search Resource Groups with wildcard filtering", code: "# List all\nGet-AzResourceGroup\n\n# Filter with wildcard\nGet-AzResourceGroup | Where-Object {$_.ResourceGroupName -like \"*prod*\"}\n\n# Specific RG\nGet-AzResourceGroup -Name \"myRG\"",
        params: [["-Name","Filters by exact name"],["-Location","Filters by region"]] },
      { name: "Remove-AzResourceGroup", desc: "Delete Resource Group and ALL resources it contains", code: "# Synchronous (waits to finish)\nRemove-AzResourceGroup -Name \"myRG\" -Force\n\n# Async (background job)\nRemove-AzResourceGroup -Name \"myRG\" -Force -AsJob",
        params: [["-Force","Without prompt"],["-AsJob","Runs in background"]] },
      { name: "Export-AzResourceGroup", desc: "Export an RG to ARM Template (JSON) for IaC", code: "Export-AzResourceGroup -ResourceGroupName \"myRG\" `\n  -Path \"C:\\templates\\myRG.json\" -IncludeComments",
        params: [["-Path","Local save path"],["-IncludeComments","Adds comments to template"],["-IncludeParameterDefaultValue","Exports default values"]] },
      { name: "Move-AzResource", desc: "Move resource to another Resource Group or subscription", code: "$res = Get-AzResource -ResourceName \"myVM\" -ResourceGroupName \"sourceRG\"\nMove-AzResource -ResourceId $res.ResourceId `\n  -DestinationResourceGroupName \"destRG\"",
        params: [["-ResourceId","Resource ID"],["-DestinationResourceGroupName","Target RG"],["-DestinationSubscriptionId","For cross-subscription move"]] }
    ]
  },
  {
    id: "vm", label: "Compute / VMs", icon: "💻",
    cmds: [
      { name: "New-AzVM", desc: "Quick VM creation — auto-creates VNet/NIC/PublicIP", code: "New-AzVM `\n  -ResourceGroupName \"myRG\" `\n  -Name \"myVM\" `\n  -Location \"westeurope\" `\n  -Image \"Ubuntu2204\" `\n  -Size \"Standard_B2s\" `\n  -Credential (Get-Credential)\n\n# Windows Server\nNew-AzVM -ResourceGroupName \"myRG\" -Name \"winVM\" `\n  -Location \"westeurope\" -Image \"Win2022Datacenter\" `\n  -Size \"Standard_D2s_v3\" -Credential (Get-Credential)",
        params: [["-Image","Ubuntu2204, Win2022Datacenter, etc."],["-Size","Standard_B1s, D2s_v3, F4s_v2, etc."],["-Credential","Admin username/password"]] },
      { name: "Start-AzVM / Stop-AzVM", desc: "Check VM status — Stop deallocates (stops compute billing)", code: "Start-AzVM -ResourceGroupName \"myRG\" -Name \"myVM\"\n\n# Stop + deallocate (stops compute billing)\nStop-AzVM -ResourceGroupName \"myRG\" -Name \"myVM\" -Force\n\n# Restart\nRestart-AzVM -ResourceGroupName \"myRG\" -Name \"myVM\"",
        params: [["-Force","Without confirmation"],["-NoWait","Does not wait for completion"]] },
      { name: "Get-AzVM", desc: "Get detailed VM info and PowerState", code: "# All VMs with status\nGet-AzVM -ResourceGroupName \"myRG\" -Status | Select-Object Name, PowerState\n\n# Detailed information\nGet-AzVM -ResourceGroupName \"myRG\" -Name \"myVM\" | Format-List",
        params: [["-Status","Displays running/deallocated"],["-ResourceGroupName","Filters by RG"]] },
      { name: "Update-AzVM (Resize)", desc: "Change size (SKU) on existing VM — requires stop", code: "$vm = Get-AzVM -ResourceGroupName \"myRG\" -Name \"myVM\"\n$vm.HardwareProfile.VmSize = \"Standard_D4s_v3\"\nUpdate-AzVM -ResourceGroupName \"myRG\" -VM $vm",
        params: [["-VM","The modified VM object"]] },
      { name: "Set-AzVMExtension", desc: "Install extension on VM (Custom Script, DSC, Monitoring etc.)", code: "Set-AzVMExtension `\n  -ResourceGroupName \"myRG\" `\n  -VMName \"myVM\" `\n  -Name \"CustomScript\" `\n  -Publisher \"Microsoft.Compute\" `\n  -ExtensionType \"CustomScriptExtension\" `\n  -TypeHandlerVersion \"1.10\" `\n  -Settings @{fileUris=@(\"https://raw.githubusercontent.com/.../setup.ps1\"); commandToExecute=\"powershell.exe -File setup.ps1\"}",
        params: [["-Publisher","Namespace publisher"],["-Settings","JSON config for the extension"]] },
      { name: "Remove-AzVM", desc: "Delete VM — WARNING: does not delete disk/NIC automatically", code: "Remove-AzVM -ResourceGroupName \"myRG\" -Name \"myVM\" -Force\n\n# Full cleanup (VM + Disk + NIC + PublicIP)\n$vm = Get-AzVM -ResourceGroupName \"myRG\" -Name \"myVM\"\n$diskId   = $vm.StorageProfile.OsDisk.ManagedDisk.Id\n$nicId    = $vm.NetworkProfile.NetworkInterfaces[0].Id\nRemove-AzVM -ResourceGroupName \"myRG\" -Name \"myVM\" -Force\nRemove-AzDisk -ResourceGroupName \"myRG\" -DiskName ($diskId.Split(\"/\")[-1]) -Force\nRemove-AzNetworkInterface -ResourceGroupName \"myRG\" -Name ($nicId.Split(\"/\")[-1]) -Force",
        params: [["-Force","Without confirmation"]] }
    ]
  },
  {
    id: "net", label: "Networking", icon: "🌐",
    cmds: [
      { name: "New-AzVirtualNetwork", desc: "Create VNet and Subnet in one step", code: "$subnet = New-AzVirtualNetworkSubnetConfig -Name \"Subnet1\" -AddressPrefix \"10.0.1.0/24\"\nNew-AzVirtualNetwork `\n  -ResourceGroupName \"myRG\" `\n  -Name \"myVNet\" `\n  -Location \"westeurope\" `\n  -AddressPrefix \"10.0.0.0/16\" `\n  -Subnet $subnet",
        params: [["-AddressPrefix","CIDR block (e.g., 10.0.0.0/16)"],["-Subnet","Subnet config object"]] },
      { name: "New-AzNetworkSecurityRuleConfig", desc: "Create NSG Firewall rule (Allow/Deny)", code: "$rule = New-AzNetworkSecurityRuleConfig -Name \"Allow-RDP\" `\n  -Protocol Tcp -Direction Inbound -Priority 100 `\n  -SourceAddressPrefix \"10.0.0.0/8\" `\n  -SourcePortRange * `\n  -DestinationAddressPrefix * `\n  -DestinationPortRange 3389 `\n  -Access Allow\n\nNew-AzNetworkSecurityGroup -ResourceGroupName \"myRG\" `\n  -Name \"myNSG\" -Location \"westeurope\" `\n  -SecurityRules $rule",
        params: [["-Direction","Inbound or Outbound"],["-Priority","100-4096 (lower = higher priority)"],["-Access","Allow or Deny"]] },
      { name: "New-AzPublicIpAddress", desc: "Create Static or Dynamic Public IP", code: "New-AzPublicIpAddress -ResourceGroupName \"myRG\" `\n  -Name \"myPublicIP\" -Location \"westeurope\" `\n  -AllocationMethod Static -Sku Standard `\n  -DomainNameLabel \"myapp-unique-label\"",
        params: [["-AllocationMethod","Static or Dynamic"],["-Sku","Basic or Standard"],["-DomainNameLabel","Creates DNS name"]] },
      { name: "New-AzLoadBalancer", desc: "Create Standard Load Balancer with frontend IP", code: "$pip   = Get-AzPublicIpAddress -Name \"myPublicIP\" -ResourceGroupName \"myRG\"\n$feip  = New-AzLoadBalancerFrontendIpConfig -Name \"FE\" -PublicIpAddress $pip\n$bepool= New-AzLoadBalancerBackendAddressPoolConfig -Name \"BE\"\nNew-AzLoadBalancer -ResourceGroupName \"myRG\" -Name \"myLB\" `\n  -Location \"westeurope\" -Sku Standard `\n  -FrontendIpConfiguration $feip `\n  -BackendAddressPool $bepool",
        params: [["-Sku","Basic or Standard"],["-FrontendIpConfiguration","Frontend config object"]] },
      { name: "Get-AzNetworkInterface", desc: "Get NIC info — IPs, MAC, VM attachment", code: "Get-AzNetworkInterface -ResourceGroupName \"myRG\" | Select-Object Name, MacAddress\n\n# Detailed IP config\n(Get-AzNetworkInterface -Name \"myNIC\" -ResourceGroupName \"myRG\").IpConfigurations",
        params: [["-ResourceGroupName","Filters by RG"],["-Name","Specific NIC"]] }
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
      { name: "New-AzStorageAccount", desc: "Create Storage Account (Blob, Files, Queues, Tables)", code: "New-AzStorageAccount -ResourceGroupName \"myRG\" `\n  -Name \"mystorageapp123\" `\n  -Location \"westeurope\" `\n  -SkuName \"Standard_LRS\" `\n  -Kind \"StorageV2\" `\n  -AccessTier Hot",
        params: [["-SkuName","Standard_LRS/GRS/ZRS, Premium_LRS"],["-Kind","StorageV2 (recommended)"],["-AccessTier","Hot or Cool"]] },
      { name: "Get-AzStorageAccountKey", desc: "Retrieve Access Keys — used for context & AzCopy", code: "Get-AzStorageAccountKey -ResourceGroupName \"myRG\" -Name \"mystorageapp123\"\n\n# Save key to variable\n$key = (Get-AzStorageAccountKey -ResourceGroupName \"myRG\" -Name \"mysa\")[0].Value\n$ctx = New-AzStorageContext -StorageAccountName \"mysa\" -StorageAccountKey $key",
        params: [["-Name","Storage Account name"]] },
      { name: "New-AzStorageContainer", desc: "Create Blob Container with public access option", code: "$ctx = (Get-AzStorageAccount -ResourceGroupName \"myRG\" -Name \"mystorageapp123\").Context\nNew-AzStorageContainer -Name \"mycontainer\" -Context $ctx -Permission Off\n\n# Bulk create\n@(\"raw\",\"processed\",\"archive\") | ForEach-Object {\n  New-AzStorageContainer -Name $_ -Context $ctx -Permission Off\n}",
        params: [["-Permission","Off (Private), Blob or Container (Public)"]] },
      { name: "Set-AzStorageBlobContent", desc: "Upload file or folder to Blob Storage", code: "$ctx = New-AzStorageContext -StorageAccountName \"mysa\" -StorageAccountKey \"<key>\"\n\n# Upload single file\nSet-AzStorageBlobContent -File \"C:\\local.txt\" `\n  -Container \"mycontainer\" -Blob \"remote.txt\" `\n  -Context $ctx -Force\n\n# Bulk upload\nGet-ChildItem \"C:\\folder\\*.json\" | ForEach-Object {\n  Set-AzStorageBlobContent -File $_.FullName `\n    -Container \"mycontainer\" -Blob $_.Name -Context $ctx\n}",
        params: [["-File","Local file path"],["-Blob","Name in cloud"],["-Force","Overwrite if exists"]] },
      { name: "Get-AzStorageBlob", desc: "List blobs in container with prefix filtering", code: "$ctx = New-AzStorageContext -StorageAccountName \"mysa\" -StorageAccountKey \"<key>\"\n\n# List all\nGet-AzStorageBlob -Container \"mycontainer\" -Context $ctx\n\n# Filter with prefix\nGet-AzStorageBlob -Container \"mycontainer\" -Prefix \"logs/2024/\" -Context $ctx | Select-Object Name, Length",
        params: [["-Prefix","Filters like folder path"],["-Blob","Specific blob name"]] },
      { name: "New-AzStorageAccountSASToken", desc: "Create SAS token for secure access without key", code: "$ctx = New-AzStorageContext -StorageAccountName \"mysa\" -StorageAccountKey \"<key>\"\n\n# SAS token for Blob service\nNew-AzStorageAccountSASToken `\n  -Service Blob `\n  -ResourceType Service,Container,Object `\n  -Permission \"rwdlacupitfx\" `\n  -ExpiryTime (Get-Date).AddHours(8) `\n  -Context $ctx",
        params: [["-Service","Blob, File, Queue, Table"],["-Permission","r=read,w=write,d=delete,l=list,c=create"],["-ExpiryTime","Expiration date/time"]] },
      { name: "New-AzStorageShare", desc: "Create an Azure File Share", code: "$ctx = (Get-AzStorageAccount -ResourceGroupName \"myRG\" -Name \"mysa\").Context\nNew-AzStorageShare -Name \"myshare\" -Context $ctx -QuotaGiB 50",
        params: [["-Name","Share name"],["-QuotaGiB","Size limit in GB"]] }
    ]
  },
  {
    id: "webapp", label: "App Services / Web", icon: "🌍",
    cmds: [
      { name: "New-AzAppServicePlan", desc: "Create App Service Plan — defines pricing tier and compute", code: "New-AzAppServicePlan -ResourceGroupName \"myRG\" -Name \"myPlan\" `\n  -Location \"westeurope\" -Tier \"Standard\" -WorkerSize \"Small\"\n\n# Linux plan\nNew-AzAppServicePlan -ResourceGroupName \"myRG\" -Name \"myLinuxPlan\" `\n  -Location \"westeurope\" -Tier \"Standard\" -Linux",
        params: [["-Tier","Free, Shared, Basic, Standard, Premium"],["-WorkerSize","Small, Medium, Large"],["-Linux","For Linux hosting"]] },
      { name: "New-AzWebApp", desc: "Create Web App inside App Service Plan", code: "New-AzWebApp `\n  -ResourceGroupName \"myRG\" `\n  -Name \"myUniqueWebApp123\" `\n  -Location \"westeurope\" `\n  -AppServicePlan \"myPlan\"",
        params: [["-AppServicePlan","The App Service Plan"],["-Name","Unique global name"]] },
      { name: "Set-AzWebApp (AppSettings)", desc: "Add/update Environment Variables (App Settings)", code: "$webApp = Get-AzWebApp -ResourceGroupName \"myRG\" -Name \"myUniqueWebApp123\"\n$appSettings = @{\n  \"DB_CONNECTION\" = \"Server=myserver.database.windows.net;...\"\n  \"API_KEY\"       = \"$(Get-AzKeyVaultSecret -VaultName 'myKV' -Name 'ApiKey' -AsPlainText)\"\n}\nSet-AzWebApp -ResourceGroupName \"myRG\" -Name \"myUniqueWebApp123\" -AppSettings $appSettings",
        params: [["-AppSettings","Hashtable Key=Value"]] },
      { name: "Restart-AzWebApp", desc: "Restart Web App (without downtime deployment slot)", code: "Restart-AzWebApp -ResourceGroupName \"myRG\" -Name \"myUniqueWebApp123\"",
        params: [["-Name","Web App name"]] }
    ]
  },
  {
    id: "sql", label: "Databases / SQL", icon: "🗃️",
    cmds: [
      { name: "New-AzSqlServer", desc: "Create logical Azure SQL Server (hosting for DBs)", code: "New-AzSqlServer -ResourceGroupName \"myRG\" `\n  -ServerName \"mysqlserver123\" `\n  -Location \"westeurope\" `\n  -SqlAdministratorCredentials (Get-Credential)",
        params: [["-ServerName","Unique global name"],["-SqlAdministratorCredentials","Admin PSCredential"]] },
      { name: "New-AzSqlDatabase", desc: "Create SQL Database on logical server", code: "New-AzSqlDatabase `\n  -ResourceGroupName \"myRG\" `\n  -ServerName \"mysqlserver123\" `\n  -DatabaseName \"myDB\" `\n  -Edition \"Standard\" `\n  -RequestedServiceObjectiveName \"S2\"",
        params: [["-Edition","Basic, Standard, Premium"],["-RequestedServiceObjectiveName","S0-S12 (DTU model)"]] },
      { name: "New-AzSqlServerFirewallRule", desc: "Open Firewall for access from specific IP", code: "# Specific IP\nNew-AzSqlServerFirewallRule -ResourceGroupName \"myRG\" `\n  -ServerName \"mysqlserver123\" `\n  -FirewallRuleName \"AllowOffice\" `\n  -StartIpAddress \"192.168.1.5\" -EndIpAddress \"192.168.1.5\"\n\n# Allows Azure services (0.0.0.0)\nNew-AzSqlServerFirewallRule -ResourceGroupName \"myRG\" `\n  -ServerName \"mysqlserver123\" -AllowAllAzureIPs",
        params: [["-StartIpAddress","Start IP range"],["-AllowAllAzureIPs","Allows Azure-to-Azure"]] },
      { name: "Get-AzSqlDatabaseActivity", desc: "Monitor operations (restore, scale, import)", code: "Get-AzSqlDatabaseActivity `\n  -ResourceGroupName \"myRG\" `\n  -ServerName \"mysqlserver123\" `\n  -DatabaseName \"myDB\"",
        params: [["-DatabaseName","DB name"]] },
      { name: "Invoke-AzSqlDatabaseFailover", desc: "Force failover to secondary region", code: "Invoke-AzSqlDatabaseFailover -ResourceGroupName \"myRG\" -ServerName \"mysqlserver123\" -DatabaseName \"myDB\"",
        params: [["-DatabaseName","Database to failover"]] }
    ]
  },
  {
    id: "keyvault", label: "Key Vault", icon: "🔑",
    cmds: [
      { name: "New-AzKeyVault", desc: "Create Azure Key Vault for secrets, keys and certificates", code: "New-AzKeyVault -VaultName \"myKV-prod-001\" `\n  -ResourceGroupName \"myRG\" `\n  -Location \"westeurope\" `\n  -EnabledForDeployment `\n  -EnableSoftDelete",
        params: [["-EnabledForDeployment","Allows VMs to read secrets"],["-EnableSoftDelete","Protection from accidental deletion"],["-Sku","standard or premium (HSM)"]] },
      { name: "Set-AzKeyVaultSecret", desc: "Save Secret (password, connection string, API key)", code: "$secretval = ConvertTo-SecureString \"SuperSecretValue123!\" -AsPlainText -Force\nSet-AzKeyVaultSecret -VaultName \"myKV-prod-001\" `\n  -Name \"SQLPassword\" -SecretValue $secretval",
        params: [["-Name","Secret name"],["-SecretValue","Value as SecureString"]] },
      { name: "Get-AzKeyVaultSecret", desc: "Retrieve secret — plain text option for use in scripts", code: "# Metadata only (secure)\nGet-AzKeyVaultSecret -VaultName \"myKV-prod-001\" -Name \"SQLPassword\"\n\n# Value as plain text (use with caution)\n$pass = Get-AzKeyVaultSecret -VaultName \"myKV-prod-001\" `\n  -Name \"SQLPassword\" -AsPlainText",
        params: [["-AsPlainText","Returns as string"],["-Version","Specific secret version"]] },
      { name: "Set-AzKeyVaultAccessPolicy", desc: "Grant permissions to user/SP for Vault access", code: "$spObjectId = (Get-AzADServicePrincipal -DisplayName \"myApp\").Id\nSet-AzKeyVaultAccessPolicy -VaultName \"myKV-prod-001\" `\n  -ObjectId $spObjectId `\n  -PermissionsToSecrets Get,List\n\n# For user\nSet-AzKeyVaultAccessPolicy -VaultName \"myKV-prod-001\" `\n  -UserPrincipalName \"user@contoso.com\" `\n  -PermissionsToSecrets Get,List,Set,Delete",
        params: [["-PermissionsToSecrets","Get,List,Set,Delete,Backup,Restore,Purge"],["-PermissionsToKeys","Decrypt,Encrypt,Sign,Verify,WrapKey"]] }
    ]
  },
  {
    id: "backup", label: "Backup & DR", icon: "🛡️",
    cmds: [
      { name: "New-AzRecoveryServicesVault", desc: "Create Recovery Services Vault for Backup & Site Recovery", code: "New-AzRecoveryServicesVault -ResourceGroupName \"myRG\" -Name \"myVault\" -Location \"westeurope\"",
        params: [["-Name","Vault name"]] },
      { name: "Enable-AzRecoveryServicesBackupProtection", desc: "Enable backup on VM with specific policy", code: "$vault  = Get-AzRecoveryServicesVault -ResourceGroupName \"myRG\" -Name \"myVault\"\n$policy = Get-AzRecoveryServicesBackupProtectionPolicy -VaultId $vault.ID -Name \"DefaultPolicy\"\nEnable-AzRecoveryServicesBackupProtection `\n  -ResourceGroupName \"myRG\" -Name \"myVM\" `\n  -Policy $policy -VaultId $vault.ID",
        params: [["-Policy","The Backup Policy object"]] },
      { name: "Backup-AzRecoveryServicesBackupItem", desc: "Trigger On-Demand backup immediately (outside schedule)", code: "$vault  = Get-AzRecoveryServicesVault -ResourceGroupName \"myRG\" -Name \"myVault\"\n$cont   = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVM `\n           -FriendlyName \"myVM\" -VaultId $vault.ID\n$item   = Get-AzRecoveryServicesBackupItem -Container $cont `\n           -WorkloadType AzureVM -VaultId $vault.ID\nBackup-AzRecoveryServicesBackupItem -Item $item -VaultId $vault.ID",
        params: [["-Item","The Backup item object"]] },
      { name: "Get-AzRecoveryServicesBackupJob", desc: "Check backup jobs status (completed, failed, in-progress)", code: "$vault = Get-AzRecoveryServicesVault -ResourceGroupName \"myRG\" -Name \"myVault\"\nGet-AzRecoveryServicesBackupJob -VaultId $vault.ID | Format-Table WorkloadName, Status, StartTime",
        params: [["-VaultId","The Vault ID"],["-Status","InProgress, Completed, Failed"]] }
    ]
  },
  {
    id: "cost", label: "Cost & Governance", icon: "💰",
    cmds: [
      { name: "Get-AzConsumptionUsageDetail", desc: "Get billing data — per resource and service", code: "Get-AzConsumptionUsageDetail `\n  -StartDate (Get-Date).AddDays(-7) `\n  -EndDate (Get-Date) -Top 20 | `\n  Format-Table InstanceName, PretaxCost, Currency",
        params: [["-Top","Number of records"],["-BillingPeriodName","Specific billing period"]] },
      { name: "New-AzResourceLock", desc: "Lock resource — prevents accidental deletion (CanNotDelete)", code: "New-AzResourceLock -LockName \"DoNotDeleteLock\" `\n  -LockLevel CanNotDelete `\n  -ResourceGroupName \"myRG\" `\n  -ResourceName \"myProductionVM\" `\n  -ResourceType \"Microsoft.Compute/virtualMachines\"\n\n# Lock entire RG\nNew-AzResourceLock -LockName \"RG-Lock\" `\n  -LockLevel CanNotDelete -ResourceGroupName \"myRG\"",
        params: [["-LockLevel","CanNotDelete or ReadOnly"]] },
      { name: "Remove-AzResourceLock", desc: "Remove lock to allow resource deletion", code: "Remove-AzResourceLock -LockName \"DoNotDeleteLock\" `\n  -ResourceGroupName \"myRG\" `\n  -ResourceName \"myProductionVM\" `\n  -ResourceType \"Microsoft.Compute/virtualMachines\" -Force",
        params: [["-Force","Without prompt"]] },
      { name: "Update-AzTag", desc: "Add or update tags on any Azure resource", code: "$resourceId = (Get-AzResourceGroup -Name \"myRG\").ResourceId\nUpdate-AzTag -ResourceId $resourceId `\n  -Tag @{Environment=\"Prod\"; CostCenter=\"IT-001\"} `\n  -Operation Merge",
        params: [["-Operation","Merge (add), Replace, Delete"]] },
      { name: "New-AzPolicyAssignment", desc: "Assign an Azure Policy to a scope for compliance", code: "$policy = Get-AzPolicyDefinition | Where-Object { $_.Properties.DisplayName -eq 'Require a tag on resources' }\nNew-AzPolicyAssignment -Name \"RequireTagPolicy\" -PolicyDefinition $policy -Scope \"/subscriptions/<sub-id>\"", 
        params: [["-PolicyDefinition","The policy object"],["-Scope","Subscription or RG scope"]] }
    ]
  },
  {
    id: "azcopy", label: "AzCopy / Data Transfer", icon: "🚀",
    cmds: [
      { name: "azcopy copy (Account→Account)", desc: "Cloud-to-Cloud transfer — copies containers & blobs directly", code: "# Transfer entire Storage Account (all containers)\nazcopy copy `\n  \"https://<source-sa>.blob.core.windows.net/?<source-SAS>\" `\n  \"https://<target-sa>.blob.core.windows.net/?<target-SAS>\" `\n  --recursive\n\n# Transfer single container\nazcopy copy `\n  \"https://<source-sa>.blob.core.windows.net/<container>?<source-SAS>\" `\n  \"https://<target-sa>.blob.core.windows.net/<container>?<target-SAS>\" `\n  --recursive",
        params:[["--recursive","Copies subdirectories/blobs"],["--cap-mbps","Sets bandwidth limit (e.g., 1000)"],["--log-level","INFO, WARNING, ERROR"]] },
      { name: "azcopy sync", desc: "Sync — copies only changed/new files", code: "# Local → Cloud\nazcopy sync \"C:\\local\\folder\" `\n  \"https://mysa.blob.core.windows.net/mycontainer?<SAS>\" `\n  --delete-destination=true\n\n# Cloud → Cloud sync\nazcopy sync `\n  \"https://source.blob.core.windows.net/container?<SAS>\" `\n  \"https://target.blob.core.windows.net/container?<SAS>\"",
        params:[["--delete-destination","Deletes files that were removed"],["--recursive","Recursive sync"]] },
      { name: "azcopy login", desc: "Authenticate AzCopy — Interactive or Service Principal", code: "# Interactive (browser)\nazcopy login\n\n# Service Principal (CI/CD)\n$env:AZCOPY_SPA_CLIENT_SECRET = \"<client-secret>\"\nazcopy login `\n  --service-principal `\n  --application-id \"<app-id>\" `\n  --tenant-id \"<tenant-id>\"",
        params:[["--service-principal","Non-interactive login"],["--tenant-id","Azure Tenant"]] },
      { name: "azcopy jobs list/resume", desc: "Manage jobs — list or resume interrupted transfer", code: "# List all jobs\nazcopy jobs list\n\n# Resume failed/interrupted\nazcopy jobs resume <job-id>",
        params: [["<job-id>","The ID from the jobs list output"]] }
    ]
  },
  {
    id: "containers", label: "Containers (AKS/ACR)", icon: "☸️",
    cmds: [
      { name: "New-AzAksCluster", desc: "Create Kubernetes (AKS) Cluster", code: "New-AzAksCluster `\n  -ResourceGroupName \"myRG\" -Name \"myAKS\" `\n  -NodeCount 3 -NodeVmSize \"Standard_D2s_v3\" `\n  -KubernetesVersion \"1.28.0\" `\n  -Location \"westeurope\"",
        params: [["-NodeCount","Initial number of nodes"],["-NodeVmSize","VM size per node"],["-KubernetesVersion","K8s version"]] },
      { name: "Import-AzAksCredential", desc: "Retrieve kubeconfig for use with kubectl", code: "Import-AzAksCredential -ResourceGroupName \"myRG\" -Name \"myAKS\" -Force\n\n# Now you can\nkubectl get nodes\nkubectl get pods --all-namespaces",
        params: [["-Force","Overwrite existing kubeconfig"],["-Admin","Admin credentials"]] },
      { name: "Set-AzAksCluster (Scale)", desc: "Scale AKS Cluster nodes or upgrade Kubernetes version", code: "# Scale\nGet-AzAksCluster -ResourceGroupName \"myRG\" -Name \"myAKS\" | Set-AzAksCluster -NodeCount 5\n\n# Version upgrade\nSet-AzAksCluster -ResourceGroupName \"myRG\" -Name \"myAKS\" -KubernetesVersion \"1.29.0\"",
        params: [["-NodeCount","New node count"],["-KubernetesVersion","For version upgrade"]] },
      { name: "New-AzContainerRegistry", desc: "Create Azure Container Registry (ACR) for Docker images", code: "New-AzContainerRegistry -ResourceGroupName \"myRG\" `\n  -Name \"myRegistry123\" -Sku Standard `\n  -Location \"westeurope\"\n\n# Get credentials for docker login\n$creds = Get-AzContainerRegistryCredential -ResourceGroupName \"myRG\" -Name \"myRegistry123\"\ndocker login myRegistry123.azurecr.io -u $creds.Username -p $creds.Password",
        params: [["-Sku","Basic, Standard, Premium"]] }
    ]
  },
  {
    id: "serverless", label: "Serverless & Automation", icon: "⚡",
    cmds: [
      { name: "New-AzFunctionApp", desc: "Create Serverless Function App with Consumption Plan", code: "New-AzFunctionApp `\n  -ResourceGroupName \"myRG\" -Name \"myFunc123\" `\n  -StorageAccountName \"mystorageapp123\" `\n  -Location \"westeurope\" `\n  -ConsumptionPlanLocation \"westeurope\" `\n  -Runtime \"PowerShell\"",
        params: [["-Runtime","Dotnet, Node, Python, PowerShell, Java"],["-OSType","Windows or Linux"]] },
      { name: "Start-AzAutomationRunbook", desc: "Start Automation Runbook — scheduled or on-demand", code: "Start-AzAutomationRunbook `\n  -ResourceGroupName \"myRG\" `\n  -AutomationAccountName \"myAutomation\" `\n  -Name \"Stop-Idle-VMs\"\n\n# With parameters\nStart-AzAutomationRunbook -ResourceGroupName \"myRG\" `\n  -AutomationAccountName \"myAutomation\" `\n  -Name \"Scale-VMs\" `\n  -Parameters @{Environment=\"Prod\"; NodeCount=5}",
        params: [["-Parameters","Hashtable with runtime parameters"]] },
      { name: "New-AzAutomationSchedule", desc: "Create schedule for automatic execution", code: "New-AzAutomationSchedule `\n  -ResourceGroupName \"myRG\" `\n  -AutomationAccountName \"myAutomation\" `\n  -Name \"DailyAt3AM\" `\n  -StartTime (Get-Date \"03:00:00\").AddDays(1) `\n  -DayInterval 1\n\n# Link to runbook\nRegister-AzAutomationScheduledRunbook `\n  -ResourceGroupName \"myRG\" `\n  -AutomationAccountName \"myAutomation\" `\n  -ScheduleName \"DailyAt3AM\" `\n  -RunbookName \"Stop-Idle-VMs\"",
        params: [["-DayInterval","Every N days"],["-HourInterval","Every N hours"]] },
      { name: "Get-AzAutomationJob", desc: "Check status and output of executed Runbook", code: "Get-AzAutomationJob -ResourceGroupName \"myRG\" `\n  -AutomationAccountName \"myAutomation\" | `\n  Where-Object {$_.Status -eq \"Failed\"} | `\n  Format-Table RunbookName, Status, StartTime",
        params: [["-AutomationAccountName","Automation Account name"],["-Status","Queued, Running, Completed, Failed"]] }
    ]
  },
  {
    id: "messaging", label: "Messaging (Service Bus)", icon: "📬",
    cmds: [
      { name: "New-AzServiceBusNamespace", desc: "Create a Service Bus namespace for messaging", code: "New-AzServiceBusNamespace -ResourceGroupName \"myRG\" -Name \"mySBNamespace\" -Location \"westeurope\" -SkuName \"Standard\"", 
        params: [["-SkuName","Basic, Standard, Premium"]] },
      { name: "New-AzServiceBusQueue", desc: "Create a queue inside a Service Bus namespace", code: "New-AzServiceBusQueue -ResourceGroupName \"myRG\" -NamespaceName \"mySBNamespace\" -Name \"myQueue\" -EnablePartitioning $true", 
        params: [["-EnablePartitioning","Improves performance/availability"]] }
    ]
  },
  {
    id: "security", label: "Security & Entra ID", icon: "🧑‍💼",
    cmds: [
      { name: "New-AzADUser", desc: "Create new user in Entra ID (formerly Azure AD)", code: "New-AzADUser `\n  -DisplayName \"John Doe\" `\n  -UserPrincipalName \"john@contoso.com\" `\n  -Password (ConvertTo-SecureString \"P@ssw0rd123!\" -AsPlainText -Force) `\n  -MailNickname \"john\" `\n  -AccountEnabled $true",
        params: [["-UserPrincipalName","User Email/UPN"],["-MailNickname","User alias"],["-AccountEnabled","$true for active"]] },
      { name: "New-AzADServicePrincipal", desc: "Create Service Principal for automation/CI-CD", code: "$sp = New-AzADServicePrincipal -DisplayName \"myDeploymentApp\"\n\n# Display credentials (save them! shown only once)\nWrite-Host \"AppId  : $($sp.AppId)\"\nWrite-Host \"Secret : $([System.Net.NetworkCredential]::new('', $sp.PasswordCredentials.SecretText).Password)\"",
        params: [["-DisplayName","SP name"],["-Role","Azure RBAC role"],["-Scope","Scope for RBAC"]] },
      { name: "New-AzRoleAssignment", desc: "Assign RBAC role to user, group or SP", code: "# Contributor on RG\nNew-AzRoleAssignment `\n  -SignInName \"user@contoso.com\" `\n  -RoleDefinitionName \"Contributor\" `\n  -ResourceGroupName \"myRG\"\n\n# Reader on Subscription\nNew-AzRoleAssignment `\n  -ObjectId (Get-AzADUser -UserPrincipalName \"user@contoso.com\").Id `\n  -RoleDefinitionName \"Reader\" `\n  -Scope \"/subscriptions/<sub-id>\"",
        params: [["-RoleDefinitionName","Owner, Contributor, Reader, etc."],["-Scope","Subscription, RG, or resource"]] },
      { name: "Get-AzRoleAssignment", desc: "List RBAC assignments per user, RG or subscription", code: "# Per RG\nGet-AzRoleAssignment -ResourceGroupName \"myRG\"\n\n# Per user\nGet-AzRoleAssignment -SignInName \"user@contoso.com\"\n\n# Find Contributors\nGet-AzRoleAssignment | Where-Object {$_.RoleDefinitionName -eq \"Contributor\"}",
        params: [["-SignInName","User Email/UPN"],["-ResourceGroupName","Filters by RG"]] }
    ]
  },
  {
    id: "monitor", label: "Monitoring & Logs", icon: "📊",
    cmds: [
      { name: "Get-AzLog", desc: "Retrieve Activity Log — who did what and when", code: "Get-AzLog -ResourceGroupName \"myRG\" -StartTime (Get-Date).AddDays(-3)\n\n# Failed operations\nGet-AzLog -StartTime (Get-Date).AddDays(-1) | `\n  Where-Object {$_.Status.Value -eq \"Failed\"} | `\n  Format-Table Caller, OperationName, EventTimestamp",
        params: [["-StartTime","Start of time range"],["-Status","Succeeded, Failed"],["-Caller","User or SP email"]] },
      { name: "Get-AzMetric", desc: "Get metrics (CPU, Memory, Disk) for a resource", code: "$vm = Get-AzVM -ResourceGroupName \"myRG\" -Name \"myVM\"\nGet-AzMetric -ResourceId $vm.Id `\n  -MetricName \"Percentage CPU\" `\n  -StartTime (Get-Date).AddHours(-1) `\n  -EndTime (Get-Date) `\n  -TimeGrainInMinutes 5 | `\n  Select-Object -ExpandProperty Data",
        params: [["-MetricName","Percentage CPU, Network In/Out, Disk Read etc."],["-TimeGrainInMinutes","Granularity"]] },
      { name: "New-AzOperationalInsightsWorkspace", desc: "Create Log Analytics Workspace", code: "New-AzOperationalInsightsWorkspace `\n  -ResourceGroupName \"myRG\" -Name \"myLAW\" `\n  -Location \"westeurope\" -Sku \"PerGB2018\"",
        params: [["-Sku","PerGB2018 (pay-as-you-go)"]] },
      { name: "Set-AzDiagnosticSetting", desc: "Enable sending Diagnostic Logs to Log Analytics", code: "$workspace = Get-AzOperationalInsightsWorkspace -ResourceGroupName \"myRG\" -Name \"myLAW\"\n$vm = Get-AzVM -ResourceGroupName \"myRG\" -Name \"myVM\"\nSet-AzDiagnosticSetting -ResourceId $vm.Id `\n  -WorkspaceId $workspace.ResourceId `\n  -Enabled $true -Name \"SendToLogAnalytics\"",
        params: [["-Enabled","$true or $false"],["-WorkspaceId","Log Analytics Workspace ID"]] }
    ]
  },
  {
    id: "iac", label: "IaC & Deployments", icon: "📜",
    cmds: [
      { name: "New-AzResourceGroupDeployment", desc: "Deploy ARM / Bicep template to Resource Group", code: "# Deploy with preview (WhatIf)\nNew-AzResourceGroupDeployment `\n  -ResourceGroupName \"myRG\" `\n  -TemplateFile \".\\main.bicep\" -WhatIf\n\n# Actual deploy\nNew-AzResourceGroupDeployment `\n  -ResourceGroupName \"myRG\" `\n  -TemplateFile \".\\main.bicep\" `\n  -TemplateParameterFile \".\\params.prod.json\"",
        params: [["-TemplateFile",".bicep or .json file path"],["-WhatIf","Preview without execution"],["-TemplateParameterFile","Parameters file"]] },
      { name: "Test-AzResourceGroupDeployment", desc: "Template validation before deployment — detects errors", code: "Test-AzResourceGroupDeployment `\n  -ResourceGroupName \"myRG\" `\n  -TemplateFile \".\\main.bicep\" `\n  -TemplateParameterFile \".\\params.prod.json\"",
        params: [["-TemplateFile","The template to check"]] },
      { name: "Get-AzResourceGroupDeployment", desc: "Deployment history — status, time, result", code: "Get-AzResourceGroupDeployment -ResourceGroupName \"myRG\" | `\n  Select-Object DeploymentName, ProvisioningState, Timestamp | `\n  Sort-Object Timestamp -Descending | Select-Object -First 10",
        params: [["-ResourceGroupName","RG Name"]] },
      { name: "Stop-AzResourceGroupDeployment", desc: "Cancel active deployment that is stuck", code: "Stop-AzResourceGroupDeployment -ResourceGroupName \"myRG\" -Name \"main-20241101\"",
        params: [["-Name","Deployment name"]] }
    ]
  },
  {
    id: "ai", label: "AI & Machine Learning", icon: "🤖",
    cmds: [
      { name: "New-AzCognitiveServicesAccount", desc: "Create Azure OpenAI or Cognitive Services resource", code: "# Azure OpenAI\nNew-AzCognitiveServicesAccount `\n  -ResourceGroupName \"myRG\" -Name \"myOpenAI\" `\n  -Type \"OpenAI\" -SkuName \"S0\" `\n  -Location \"eastus\"\n\n# Computer Vision\nNew-AzCognitiveServicesAccount `\n  -ResourceGroupName \"myRG\" -Name \"myVision\" `\n  -Type \"ComputerVision\" -SkuName \"S1\" `\n  -Location \"westeurope\"",
        params: [["-Type","OpenAI, CognitiveServices, ComputerVision, TextAnalytics"],["-Location","OpenAI: eastus, swedencentral"]] },
      { name: "Get-AzCognitiveServicesAccountKey", desc: "Retrieve API Keys for application use", code: "Get-AzCognitiveServicesAccountKey -ResourceGroupName \"myRG\" -Name \"myOpenAI\"\n\n# Save as secret in Key Vault\n$keys = Get-AzCognitiveServicesAccountKey -ResourceGroupName \"myRG\" -Name \"myOpenAI\"\n$sec  = ConvertTo-SecureString $keys.Key1 -AsPlainText -Force\nSet-AzKeyVaultSecret -VaultName \"myKV\" -Name \"OpenAI-Key\" -SecretValue $sec",
        params: [["-Name","Resource name"]] },
      { name: "Get-AzCognitiveServicesAccountSkus", desc: "List available SKUs and pricing per region", code: "Get-AzCognitiveServicesAccountSkus -Location \"westeurope\"",
        params: [["-Location","Azure Region"]] }
    ]
  },
  {
    id: "hybrid", label: "Hybrid & Azure Arc", icon: "🔀",
    cmds: [
      { name: "New-AzConnectedMachine", desc: "Register On-Premises server to Azure via Arc", code: "# Executed locally on the on-prem server\nRegister-AzResourceProvider -ProviderNamespace Microsoft.HybridCompute\n\n# Download onboarding script from portal or:\nNew-AzConnectedMachine -ResourceGroupName \"hybridRG\" `\n  -Name \"LocalServer01\" -Location \"westeurope\"",
        params: [["Microsoft.HybridCompute","Required resource provider"]] },
      { name: "Get-AzConnectedMachine", desc: "List Arc servers — status Online/Offline, OS, version", code: "Get-AzConnectedMachine -ResourceGroupName \"hybridRG\" | `\n  Select-Object Name, Status, OsName, AgentVersion",
        params: [["-ResourceGroupName","Filters by RG"]] },
      { name: "Remove-AzConnectedMachine", desc: "Disconnect and remove Arc server from Azure", code: "Remove-AzConnectedMachine -ResourceGroupName \"hybridRG\" -Name \"LocalServer01\" -Force",
        params: [["-Force","Without confirmation"]] }
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
  }
];
