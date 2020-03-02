<?php
  include_once  $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/dbclass.php';
  include_once  $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/appconfig.php';
  require('fpdf.php');
  date_default_timezone_set("Europe/Lisbon");
  $user =json_decode($_POST['user']);
  $servicos =json_decode($_POST['servicos']);
  $allServices = json_decode($_POST['allServices']);
  $data = $_POST['data'];
  $actual = $_POST['actual-data'];
  $dbclass = new DBClass();
  $connection = $dbclass->getConnection();
  $actualPage = 1;
  $totalPages = 1;
  $totalPages += sizeOf($servicos);
  foreach ($servicos as $servico) {
    $totalPages += sizeOf($servico->episodios);
  }
  $pdf = new FPDF('P','mm','A4');
  $pdf->AddPage();
  $pdf->Image($_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/images/repptsaude.jpg', 10, 3, 50);
  $pdf->Image($_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/images/sns.jpg', 85, 9, 50);
  $pdf->Image($_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/images/chuc.jpg', 168, 9, 32);
  $pdf->SetFont('Arial','B',11);
  $pdf->SetXY(146, 31); 
  $pdf->Write(0, utf8_decode("Conselho de Administração"));
  $pdf->SetFont('Arial','B',10);
  $pdf->SetXY(12, 50); 
  $pdf->Write(0, utf8_decode("Data: "));
  $pdf->SetFont('Arial','',10);
  $pdf->SetXY(22, 50); 
  $pdf->Write(0, date("Y-m-d"));
  $pdf->SetFont('Arial','B',10);
  $pdf->SetXY(12, 57); 
  $pdf->Write(0, utf8_decode("Assunto: "));
  $pdf->SetFont('Arial','',10);
  $pdf->SetXY(29, 57); 
  $pdf->Write(0, utf8_decode("Pagamento de Cirurgia Adicional - ".$actual));
  $pdf->Rect(10,67,189,8);
  $pdf->SetFont('Arial','B',10);
  $pdf->SetXY(12, 71); 
  $pdf->Write(0, utf8_decode("Produção Cirúrgica Adicional realizada em ".$data));
  $pdf->SetFillColor(230, 230, 230);
  $pdf->Rect(10,75,150,8, 'FD');
  $pdf->Rect(160,75,39,8, 'FD');
  $pdf->SetFont('Arial','',10);
  $pdf->SetXY(12, 79); 
  $pdf->Write(0, utf8_decode("Tipo de Suplemento"));
  $pY = 83;
  $total = 0;
  foreach ($allServices as $servico_can) {
    $servico = NULL;
    for ($i=0; $i < sizeof($servicos); $i++) { 
      if($servico_can->id == $servicos[$i]->id){
        $servico = $servicos[$i];
        break;
      }
    }
      if($servico == NULL){
        // $pdf->Rect(10,$pY,150,8);
        // $pdf->Rect(160,$pY,39,8);
        // $pdf->SetFont('Arial','',10);
        // $pdf->SetXY(12, $pY + 4); 
        // $pdf->Write(0, utf8_decode("Produção Cirúrgica Adicional - " . $servico_can->servico));
        // $pdf->SetXY(162, $pY + 4);
        // $pdf->Cell(0, 0, utf8_decode("0.00 ").chr(128)."  ", 0, true, 'R');
      } else{
        $pdf->Rect(10,$pY,150,8);
        $pdf->Rect(160,$pY,39,8);
        $pdf->SetFont('Arial','',10);
        $pdf->SetXY(12, $pY + 4); 
        $pdf->Write(0, utf8_decode("Produção Cirúrgica Adicional - " . $servico->servico));
        $pdf->SetXY(162, $pY + 4);
        $pdf->Cell(0, 0, utf8_decode(number_format($servico->valorPorValidar, 2, '.', '')." ").chr(128)."  ", 0, true, 'R');
        $total += $servico->valorPorValidar;
        $pY+=8;
      } 
  }
  $pdf->SetFont('Arial','B',10);
  $pdf->Rect(10,$pY,150,8);
  $pdf->Rect(160,$pY,39,8);
  $pdf->SetXY(148, $pY + 4); 
  $pdf->Write(0, "Total");
  $pdf->SetXY(162, $pY + 4);
  $pdf->Cell(0, 0, utf8_decode(number_format($total, 2, '.', '')." ").chr(128)."  ", 0, true, 'R');
  $pdf->SetFont('Arial','',10);
  $pdf->SetXY(80, $pY + 30); 
  $pdf->Write(0, utf8_decode("O Conselho de Administração"));
  $pdf->SetXY(100, 275); 
  $pdf->Write(0, utf8_decode($actualPage."/".$totalPages));
  foreach ($servicos as $servico) {
    $pdf->AddPage();
    $actualPage++;
    $pdf->SetXY(100, 275); 
    $pdf->Write(0, utf8_decode($actualPage."/".$totalPages));
    $pdf->Image($_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/images/repptsaude.jpg', 10, 3, 50);
    $pdf->Image($_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/images/sns.jpg', 85, 9, 50);
    $pdf->Image($_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/images/chuc.jpg', 168, 9, 32);
    $pdf->SetFont('Arial','B',11);
    $pdf->SetXY(146, 31); 
    $pdf->Write(0, utf8_decode("Conselho de Administração"));
    $pdf->SetFont('Arial','B',10);
    $pdf->SetXY(12, 50); 
    $pdf->Write(0, utf8_decode("Período: "));
    $pdf->SetFont('Arial','',10);
    $pdf->SetXY(27, 50); 
    $pdf->Write(0, $data);
    $pdf->SetFont('Arial','B',10);
    $pdf->SetXY(12, 57); 
    $pdf->Write(0, utf8_decode("Serviço: "));
    $pdf->SetFont('Arial','',10);
    $pdf->SetXY(27, 57); 
    $pdf->Write(0, utf8_decode($servico->servico));
    $episodios = $servico->episodios;
    $gdhs = [];
    foreach ($episodios as $episodio) {
      if($episodio->gdh2 !== NULL){
        if(!in_array($episodio->gdh2, $gdhs)){
          $gdhs[]= $episodio->gdh2;
        }
      }else{
        if(!in_array($episodio->gdh1, $gdhs)){
          $gdhs[]= $episodio->gdh1;
        }
      }
    }
    if(sizeof($gdhs)>0){
      $sql = 'SELECT * FROM data_adicional_gdh WHERE id IN ('.implode(",",$gdhs).')';
      $stmt = $connection->prepare($sql);
      $stmt->execute();
      $entireGDHs = $stmt->fetchAll(PDO::FETCH_ASSOC);
      $iY = 70;
      $pdf->SetFillColor(230, 230, 230);
      $pdf->Rect(10,$iY,47.5,8 ,'FD');
      $pdf->Rect(57.5,$iY,47.5,8,'FD');
      $pdf->Rect(105,$iY,47.5,8,'FD');
      $pdf->Rect(152.5,$iY,47.5,8,'FD');
      $pdf->SetFont('Arial','B',10);
      $pdf->SetXY(12, $iY+4); 
      $pdf->Write(0, utf8_decode("GDH "));
      $pdf->SetXY(59.5, $iY+4); 
      $pdf->Write(0, utf8_decode("Valor Unitário "));
      $pdf->SetXY(107, $iY+4); 
      $pdf->Write(0, utf8_decode("Nr. Episódios "));
      $pdf->SetXY(154.5, $iY+4); 
      $pdf->Write(0, utf8_decode("Valor Correspondente "));
      $iY += 8;
      $total = 0;
      foreach ($entireGDHs as $entireGDH) {
        $pdf->Rect(10,$iY,47.5,8);
        $pdf->Rect(57.5,$iY,47.5,8);
        $pdf->Rect(105,$iY,47.5,8);
        $pdf->Rect(152.5,$iY,47.5,8);
        $pdf->SetFont('Arial','',10);
        $pdf->SetXY(12, $iY+4); 
        $pdf->Write(0, utf8_decode($entireGDH['gdh']));
        $pdf->SetFont('Arial','',10);
        $pdf->SetXY(0, $iY+4); 
        $pdf->Cell(105, 0, utf8_decode($entireGDH['v_uni'])." ".chr(128)."  ", 0, true, 'R');
        $nr_episodios = 0;
        $valor_correspondente = 0;
        foreach ($episodios as $episodio) {
          if(($episodio->gdh2 == NULL && $episodio->gdh1 == $entireGDH['gdh']) || $episodio->gdh2 == $entireGDH['gdh']){
            $nr_episodios++;
            $valor_correspondente += ($entireGDH['v_uni'] * $entireGDH['perc'] / 100);
          } 
        }
        $pdf->SetXY(0, $iY+4); 
        $pdf->Cell(151, 0, utf8_decode($nr_episodios), 0, true, 'R');
        $pdf->Cell(188, 0, utf8_decode($valor_correspondente)." ".chr(128), 0, true, 'R');
        $iY+=8;
        $total += $valor_correspondente;
      }
      $pdf->SetFont('Arial','B',10);
      $pdf->Rect(10,$iY,95,8, 'FD');
      $pdf->Rect(105,$iY,47.5,8);
      $pdf->Rect(152.5,$iY,47.5,8);
      $pdf->setXY(0, $iY +4);
      $pdf->Cell(103, 0, utf8_decode("Total"), 0, true, 'R');
      $pdf->Cell(141, 0, utf8_decode(sizeof($episodios)), 0, true, 'R');
      $pdf->Cell(188, 0, utf8_decode($total)." ".chr(128), 0, true, 'R');
      foreach ($episodios as $episodio) {
        $pdf->AddPage();
        $actualPage++;
        $pdf->SetFont('Arial','',10);
        $pdf->SetXY(100, 275); 
        $pdf->Write(0, utf8_decode($actualPage."/".$totalPages));
        $pdf->Image($_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/images/repptsaude.jpg', 10, 3, 50);
        $pdf->Image($_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/images/sns.jpg', 85, 9, 50);
        $pdf->Image($_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/images/chuc.jpg', 168, 9, 32);
        $pdf->SetFont('Arial','B',11);
        $pdf->SetXY(146, 31); 
        $pdf->Write(0, utf8_decode("Conselho de Administração"));
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Rect(10,45,189,8, 'FD');
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(12, 49); 
        $pdf->Write(0,"Doente:");
        $pdf->SetFont('Arial', '', 10);
        $pdf->SetXY(26, 49); 
        $pdf->Write(0, utf8_decode($episodio->nome)); 
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(110, 49); 
        $pdf->Write(0,"Dt. Estado:");
        $pdf->SetFont('Arial', '', 10);
        $pdf->SetXY(129, 49); 
        $pdf->Write(0, ($episodio->data_estado != NULL ? $episodio->data_estado : 'Indefinida') ); 
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(152, 49); 
        $pdf->Write(0,"Enviado Para Pagamento");
        //PRIMEIRA LINHA
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(12, 59); 
        $pdf->Write(0,"Dt. Cirurgia:");
        $pdf->SetFont('Arial', '', 10);
        $pdf->SetXY(34, 59); 
        $pdf->Write(0, $episodio->dta_cirurgia ); 
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(75, 59); 
        $pdf->Write(0,utf8_decode("Dt. Admissão:"));
        $pdf->SetFont('Arial', '', 10);
        $pdf->SetXY(100, 59); 
        $pdf->Write(0, $episodio->dta_admissao ); 
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(144, 59); 
        $pdf->Write(0,utf8_decode("Dt. Alta:"));
        $pdf->SetFont('Arial', '', 10);
        $pdf->SetXY(158, 59); 
        $pdf->Write(0, $episodio->dta_alta); 
        //SEGUNDA LINHA
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(12, 64); 
        $pdf->Write(0,utf8_decode("Serviço:"));
        $pdf->SetFont('Arial', '', 10);
        $pdf->SetXY(27, 64); 
        $pdf->Write(0, utf8_decode($servico->servico)); 
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(75, 64); 
        $pdf->Write(0, "Bloco:");
        $pdf->SetFont('Arial', '', 10);
        $pdf->SetXY(87, 64); 
        $pdf->Write(0, utf8_decode($episodio->bloco)); 
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(144, 64); 
        $pdf->Write(0,utf8_decode("Tipo. Cir:"));
        $pdf->SetFont('Arial', '', 10);
        $pdf->SetXY(161, 64); 
        $pdf->Write(0, utf8_decode($episodio->tipo_cirurgia)); 
        //TERCEIRA LINHA
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(12, 69); 
        $pdf->Write(0,utf8_decode("GDH Estat:"));
        $pdf->SetFont('Arial', '', 10);
        $pdf->SetXY(32, 69); 
        $pdf->Write(0, ($episodio->gdh1 != NULL ? $episodio->gdh1 : 'Indefinido') ); 
        $episodio_gdh = $episodio->gdh2 != NULL ? $episodio->gdh2 : $episodio->gdh1;
        for ($i=0; $i < sizeof($entireGDHs) ; $i++) { 
          $episodio_candidate = $entireGDHs[$i];
          if($episodio_candidate['id'] == $episodio_gdh){
            $episodio_gdh = $episodio_candidate;
            break;
          }
        }
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(12, 74); 
        $pdf->Write(0, "GDH 1:");
        $pdf->SetFont('Arial', '', 10);
        $pdf->SetXY(25, 74); 
        $pdf->Write(0, $episodio_gdh['gdh'] . " - " . utf8_decode($episodio_gdh['desc']) ." - ". number_format(($episodio_gdh['v_uni'] * $episodio_gdh['perc'] / 100), 2, '.', '') . chr(128)); 
        //DIAGNOSTICOS
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Rect(10, 83, 189, 8,  'FD');
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(12, 87); 
        $pdf->Write(0, utf8_decode("Diagnósticos"));
        $dy = 91;
        foreach ($episodio->diagnosticos as $diagnostico) {
          $pdf->Rect(10, $dy, 189, 7);
          $pdf->SetFont('Arial','B', 10);
          $pdf->SetXY(12, $dy + 3.5); 
          $pdf->Write(0, $diagnostico->sigla);
          $pdf->SetFont('Arial','', 10);
          $pdf->SetXY(24, $dy + 3.5); 
          $pdf->Write(0, $diagnostico->nome);
          $dy+=7;
        }
        $dy += 7;
        //INTERVENCOES
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Rect(10, $dy, 189, 8,  'FD');
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(12, $dy + 4); 
        $pdf->Write(0, utf8_decode("Intervenções"));
        $dy+=8;
        foreach ($episodio->intervencoes as $intervencao) {
          $pdf->Rect(10, $dy, 189, 7);
          $pdf->SetFont('Arial','B', 10);
          $pdf->SetXY(12, $dy + 3.5); 
          $pdf->Write(0, $intervencao->sigla);
          $pdf->SetFont('Arial','', 10);
          $pdf->SetXY(24, $dy + 3.5); 
          $pdf->Write(0, $intervencao->nome);
          $dy+=7;
        }
        $dy+=7;
        //EQUIPA CIRURGICA
        $pdf->Rect(10, $dy, 189, 8,  'FD');
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(12, $dy + 4); 
        $pdf->Write(0, utf8_decode("Equipa Cirúrgica"));
        $dy+=8;
        $countEC = 0;
        foreach ($episodio->intervenientes as $interveniente) {
          $funcao = $interveniente->funcao;
          if($funcao->equipa == 'EC'){
            $countEC++;
            $pdf->Rect(10, $dy, 189, 7);
            $pdf->SetFont('Arial','B', 9);
            $pdf->SetXY(12, $dy + 3.5); 
            $pdf->Write(0, utf8_decode($interveniente->id_prof));
            $pdf->SetFont('Arial','', 8);
            $pdf->SetXY(25, $dy + 4); 
            $pdf->Write(0, utf8_decode(substr($interveniente->nome, 0, 33)) . (strlen($interveniente->nome) > 33 ? '...' : ''));
            $pdf->SetFont('Arial','', 8);
            $pdf->SetXY(89, $dy + 4); 
            $pdf->Write(0, utf8_decode($funcao->sigla) . " - " . utf8_decode(substr($funcao->funcao, 0, 25)) . (strlen($funcao->funcao) > 25 ? '...' : '') );
            $pdf->SetFont('Arial','B', 9);
            $pdf->SetXY(148, $dy + 3.5); 
            $pdf->Write(0, "Perc:");
            $pdf->SetFont('Arial','', 9);
            $pdf->SetXY(158, $dy + 3.5); 
            $pdf->Write(0, $funcao->perc . " %");
            $pdf->SetFont('Arial','B', 9);
            $pdf->SetXY(172, $dy + 3.5); 
            $pdf->Write(0, "Valor:");
            $pdf->SetFont('Arial','', 9);
            $pdf->SetXY(182, $dy + 3.5); 
            $pdf->Write(0, number_format(($episodio_gdh['v_uni'] * $episodio_gdh['perc'] / 100 * $funcao->perc / 100), 2, '.', ''). " ".chr(128));
            $dy+=7;
          }
        }
        if($countEC == 0){
          $pdf->Rect(10, $dy, 275, 7);
          $pdf->SetFont('Arial','', 10);
          $pdf->SetXY(12, $dy + 3.5); 
          $pdf->Write(0, utf8_decode("Nenhum Elemento na Equia Cirúrugica"));
          $dy+=7;
        }
        $dy+=7;
        //EQUIPA APOIO
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Rect(10, $dy, 189, 8,  'FD');
        $pdf->SetFont('Arial','B', 10);
        $pdf->SetXY(12, $dy + 4); 
        $pdf->Write(0, utf8_decode("Equipa de Apoio"));
        $dy+=8;
        $countEA = 0;
        foreach ($episodio->intervenientes as $interveniente) {
          $funcao = $interveniente->funcao;
          if($funcao->equipa == 'EA'){
            $countEA++;
            $pdf->Rect(10, $dy, 189, 7);
            $pdf->SetFont('Arial','B', 9);
            $pdf->SetXY(12, $dy + 3.5); 
            $pdf->Write(0, utf8_decode($interveniente->id_prof));
            $pdf->SetFont('Arial','', 8);
            $pdf->SetXY(25, $dy + 4); 
            $pdf->Write(0, utf8_decode(substr($interveniente->nome, 0, 33)) . (strlen($interveniente->nome) > 33 ? '...' : ''));    $pdf->SetFont('Arial','B', 10);
            $pdf->SetFont('Arial','', 8);
            $pdf->SetXY(89, $dy + 4); 
            $pdf->Write(0, utf8_decode($funcao->sigla) . " - " . utf8_decode(substr($funcao->funcao, 0, 25)) . (strlen($funcao->funcao) > 25 ? '...' : '') );
            $pdf->SetFont('Arial','B', 9);
            $pdf->SetXY(148, $dy + 3.5); 
            $pdf->Write(0, "Perc:");
            $pdf->SetFont('Arial','', 9);
            $pdf->SetXY(158, $dy + 3.5); 
            $pdf->Write(0, $funcao->perc . " %");
            $pdf->SetFont('Arial','B', 9);
            $pdf->SetXY(172, $dy + 3.5); 
            $pdf->Write(0, "Valor:");
            $pdf->SetFont('Arial','', 9);
            $pdf->SetXY(182, $dy + 3.5); 
            $pdf->Write(0, number_format(($episodio_gdh['v_uni'] * $episodio_gdh['perc'] / 100 * $funcao->perc / 100), 2, '.', ''). " ".chr(128));
            $dy+=7;
          }
        }
        if($countEA == 0){
          $pdf->Rect(10, $dy, 275, 7);
          $pdf->SetFont('Arial','', 10);
          $pdf->SetXY(12, $dy + 3.5); 
          $pdf->Write(0, utf8_decode("Nenhum Elemento na Equia de Apoio"));
        }
      }
    }
  }

  $pdf->Output("F",$_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/generatedPDFS/nome.pdf'); 
  echo json_encode('api/generatedPDFS/nome.pdf');












