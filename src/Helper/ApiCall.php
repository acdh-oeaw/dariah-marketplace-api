<?php

namespace dhma\Helper;

use GuzzleHttp\Client;

class ApiCall {

    const BASE_URL = 'https://marketplace-api.sshopencloud.eu/api/';
    const API_URL_OVERVIEW = 'item-search?categories=tool-or-service&f.keyword=DARIAH Resource&order=label';
    const API_URL_OVERVIEW_CORE = 'item-search?categories=tool-or-service&f.keyword=DARIAH Core Service&order=label';
    const API_URL_DETAIL = 'tools-services/';
    private $pluginDir;
    
    public function __construct(string $pluginDir) {
        $this->pluginDir = $pluginDir;
    }
    /**
     * Get the detail view
     * @param string $id
     * @return string
     */
    public function getDetail(string $id): string {
        return $this->makeRequest(self::API_URL_DETAIL.$id);
    }
    
    /**
     * 
     * @param string $url
     * @return array
     */
    private function getFormatData(string $url): array {
        $data = $this->makeRequest($url, array("perpage" => 100));
        
        $top100 = json_decode($data, true);
        $json = "";
        
        if($top100['hits'] > 100) {
            $pages = $top100['pages'];
            for ($x = 2; $x <= $pages; $x++) {
                $result = [];
                $result = json_decode($this->makeRequest($url, array("perpage" => 100, 'page' => $x)), true);
                $top100['items'] = array_merge($top100['items'], $result['items']);
            } 
        }
        
        if(count($top100['items']) === 0) {
            return [];
        }
        
        //fetch media;
        $ids = array_column($top100['items'], 'persistentId');
        foreach($ids as $id) {
            $media =  json_decode($this->getDetail($id), true);
            $top100['thumbnail'][$id] = $media['thumbnail'];
        }
        return array('items' => $top100['items'], 'thumbnail' => $top100['thumbnail']);
    }
    
    public function getOverview(array $opt): bool {
        $fd = [];
        $basic = $this->getFormatData(self::API_URL_OVERVIEW);
        if(count($basic) > 0) {
            $fd['overview'] = $basic;
        }
        
        $core = $this->getFormatData(self::API_URL_OVERVIEW_CORE);
        if(count($core) > 0) {
            $fd['core'] = $core;
        }
        
        //create file
        $json = \GuzzleHttp\json_encode($fd);
         
        try {
            file_put_contents($this->pluginDir."/api-data.json", $json);
        } catch (\Exception $ex) {
            return false;
        }
        return true;
    }

    private function makeRequest(string $url, array $opt = []): string {
        try {
            $client = new Client([]);
            $req_url = self::BASE_URL . $url;
            if(isset($opt['page'])) {
               $req_url = $req_url.'&page='.$opt['page'];
            }
            
            if(isset($opt['perpage'])) {
               $req_url = $req_url.'&perpage='.$opt['perpage'];
            }
            
            if(isset($opt['searchStr'])) {
               $req_url = $req_url.'&q='.$opt['searchStr'];
            }
            $response = $client->request('GET', $req_url);
            return $response->getBody()->getContents();
        } catch (\Exception $ex) {
            die(print_r($ex->getMessage(), true));
            return "";
        }
    }
}
